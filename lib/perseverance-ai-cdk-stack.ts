import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as nodejsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export interface WebsiteStackProps extends cdk.StackProps {
  domainName: string;
  siteSubDomain?: string;
  adminEmail?: string; // Email to receive lead notifications
}

export class PerseveranceAiCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    // Define domain names
    const domainName = props.domainName;
    const siteSubDomain = props.siteSubDomain || 'www';
    const siteDomain = siteSubDomain + '.' + domainName;
    const apexDomain = domainName; // Add apex domain (without www)
    const adminEmail = props.adminEmail;

    // Create the S3 bucket for website content
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: siteDomain.toLowerCase(), // Ensure lowercase for S3 naming
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // Block direct public access
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change to RETAIN for production
      autoDeleteObjects: true, // Change to false for production
    });
    
    // Create OAI for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: `OAI for ${siteDomain}`,
    });

    // IMPORTANT: Use the high-level grant method which properly configures the policy
    siteBucket.grantRead(originAccessIdentity);

    // Try to find the hosted zone
    let hostedZone;
    try {
      // Look up the hosted zone directly by its domain name
      hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
        domainName: domainName,
      });
      console.log(`Found hosted zone for domain ${domainName}`);
    } catch (error) {
      console.warn(`Could not find hosted zone for domain ${domainName}: ${error}`);
    }

    // Create ACM certificate if we have a hosted zone
    let certificate;
    if (hostedZone) {
      certificate = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
        domainName: siteDomain,
        subjectAlternativeNames: [apexDomain], // Add apex domain as SANs
        hostedZone: hostedZone,
        region: 'us-east-1', // CloudFront requires certificates in us-east-1
      });
    }

    // Create DynamoDB table for leads
    const leadsTable = new dynamodb.Table(this, 'LeadsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Important to keep your leads!
      pointInTimeRecovery: true,
    });

    // Create SES verification for admin email if provided
    if (hostedZone) {
      new ses.EmailIdentity(this, "DomainIdentity", {
        identity: ses.Identity.domain(domainName),
      });
    }

    if (adminEmail) {
      new ses.EmailIdentity(this, 'AdminEmailIdentity', {
        identity: ses.Identity.email(adminEmail),
      });
    }

 // Create Lambda function for contact form handling - Use NodejsFunction instead of Lambda
const contactFormHandler = new nodejsLambda.NodejsFunction(this, 'ContactFormHandler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  entry: path.join(__dirname, '../lambda/contact-form-handler.ts'), // Path to your TS source file
  handler: 'handler',
  bundling: {
    forceDockerBundling: false,
    minify: true, // Minify code for better performance
    sourceMap: true, // Include source maps for easier debugging
  },
  environment: {
    LEADS_TABLE_NAME: leadsTable.tableName,
    ADMIN_EMAIL: adminEmail || '',
  },
});

    // Grant Lambda permissions to write to DynamoDB and send emails
    leadsTable.grantWriteData(contactFormHandler);
    contactFormHandler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'], // Scope this down in production
    }));

    // Create API Gateway
    const api = new apigw.RestApi(this, 'ContactFormApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS, // Restrict to your domain in production
        allowMethods: apigw.Cors.ALL_METHODS,
      },
      deployOptions: {
        stageName: 'prod',
        loggingLevel: apigw.MethodLoggingLevel.INFO,
      },
    });

    // Add contact form endpoint
    const contactResource = api.root.addResource('api').addResource('contact');
    contactResource.addMethod('POST', new apigw.LambdaIntegration(contactFormHandler));

    // Create the CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket, {
          originAccessIdentity, // Use the OAI
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(`${api.restApiId}.execute-api.${this.region}.amazonaws.com`, {
            originPath: '/prod',
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
      },
      defaultRootObject: 'index.html', // Important for serving the homepage
      domainNames: hostedZone ? [siteDomain, apexDomain] : undefined, // Add both domains
      certificate: certificate,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/error.html',
        },
      ],
    });

    // Create DNS records if we have a hosted zone
    if (hostedZone) {
      // Create A record for www subdomain
      new route53.ARecord(this, 'SiteAliasRecord', {
        recordName: siteDomain,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        zone: hostedZone,
      });
      
      // Create A record for apex domain (without www)
      new route53.ARecord(this, 'ApexAliasRecord', {
        recordName: apexDomain,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        zone: hostedZone,
      });
    }

    // Deploy website contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../website'))],
      destinationBucket: siteBucket,
      distribution, // Reference the distribution to trigger invalidation
      distributionPaths: ['/*'], // Invalidate all paths after deployment
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront distribution domain name',
    });

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    // Output the API Gateway endpoint for contact form submissions
    new cdk.CfnOutput(this, 'ContactFormEndpoint', {
      value: `${api.url}contact`,
      description: 'Endpoint for contact form submissions',
    });

    // Output the S3 bucket name
    new cdk.CfnOutput(this, 'BucketName', {
      value: siteBucket.bucketName,
      description: 'S3 bucket name',
    });

    // Output the website URLs
    if (hostedZone) {
      new cdk.CfnOutput(this, 'SiteUrl', {
        value: 'https://' + siteDomain,
        description: 'Website URL (www)',
      });
      
      new cdk.CfnOutput(this, 'ApexUrl', {
        value: 'https://' + apexDomain,
        description: 'Website URL (apex domain)',
      });
    }
    
    // Output the DynamoDB table name
    new cdk.CfnOutput(this, 'LeadsTableName', {
      value: leadsTable.tableName,
      description: 'DynamoDB table for leads',
    });
  }
}
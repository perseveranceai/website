import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export interface GammaStackProps extends cdk.StackProps {
    domainName: string;
}

export class PerseveranceAiGammaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: GammaStackProps) {
        super(scope, id, props);

        const domainName = props.domainName;
        const gammaDomain = `gamma.${domainName}`;

        // ─── S3 Bucket ───────────────────────────────────────────────
        const siteBucket = new s3.Bucket(this, 'GammaSiteBucket', {
            bucketName: gammaDomain.toLowerCase(),
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // ─── CloudFront OAI ──────────────────────────────────────────
        const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'GammaOAI', {
            comment: `OAI for ${gammaDomain}`,
        });
        siteBucket.grantRead(originAccessIdentity);

        // ─── Route 53 Hosted Zone ────────────────────────────────────
        const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
            domainName: domainName,
        });

        // ─── ACM Certificate ─────────────────────────────────────────
        const certificate = new acm.DnsValidatedCertificate(this, 'GammaCertificate', {
            domainName: gammaDomain,
            hostedZone: hostedZone,
            region: 'us-east-1', // CloudFront requires us-east-1
        });

        // ─── CloudFront Function: Basic Auth ────────────────────────
        // Authorized users share one password, supplied at synth time via
        // GAMMA_BASIC_AUTH_PASSWORD (see .env) — never hardcode it in source.
        //   - rakeshp@perseveranceai.com
        //   - damodharam@perseveranceai.com
        const gammaAuthPassword = process.env.GAMMA_BASIC_AUTH_PASSWORD;
        if (!gammaAuthPassword) {
            throw new Error('GAMMA_BASIC_AUTH_PASSWORD env var is required to deploy PerseveranceAiGammaStack');
        }
        const gammaAuthUsers = ['rakeshp@perseveranceai.com', 'damodharam@perseveranceai.com'];
        const validCredentials = gammaAuthUsers.map(
            user => `"Basic ${Buffer.from(`${user}:${gammaAuthPassword}`).toString('base64')}"`
        );
        const basicAuthFunction = new cloudfront.Function(this, 'GammaBasicAuthFunction', {
            functionName: 'gamma-basic-auth',
            code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
    var request = event.request;
    var headers = request.headers;
    var validCredentials = [
        ${validCredentials.join(',\n        ')}
    ];

    if (
        typeof headers.authorization === "undefined" ||
        validCredentials.indexOf(headers.authorization.value) === -1
    ) {
        return {
            statusCode: 401,
            statusDescription: "Unauthorized",
            headers: {
                "www-authenticate": { value: "Basic realm=\\"Gamma Environment\\"" },
            },
        };
    }

    return request;
}
            `.trim()),
            comment: 'Basic Auth for gamma environment access control',
        });

        // ─── CloudFront Distribution ─────────────────────────────────
        const distribution = new cloudfront.Distribution(this, 'GammaDistribution', {
            defaultBehavior: {
                origin: new origins.S3Origin(siteBucket, {
                    originAccessIdentity,
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                functionAssociations: [{
                    function: basicAuthFunction,
                    eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                }],
            },
            defaultRootObject: 'index.html',
            domainNames: [gammaDomain],
            certificate: certificate,
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 404,
                    responsePagePath: '/error.html',
                },
            ],
        });

        // ─── Route 53 A Record ───────────────────────────────────────
        new route53.ARecord(this, 'GammaAliasRecord', {
            recordName: gammaDomain,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone: hostedZone,
        });

        // ─── Deploy Website to S3 ────────────────────────────────────
        new s3deploy.BucketDeployment(this, 'DeployGammaWebsite', {
            sources: [s3deploy.Source.asset(path.join(__dirname, '../website'))],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });

        // ─── IAM User for Co-Founder's Claude Code ──────────────────
        const cofounderUser = new iam.User(this, 'CofounderClaudeCodeUser', {
            userName: 'damodhara',
        });

        // S3 permissions scoped to gamma bucket
        cofounderUser.addToPolicy(new iam.PolicyStatement({
            sid: 'GammaS3Access',
            effect: iam.Effect.ALLOW,
            actions: [
                's3:PutObject',
                's3:GetObject',
                's3:DeleteObject',
                's3:ListBucket',
            ],
            resources: [
                siteBucket.bucketArn,
                `${siteBucket.bucketArn}/*`,
            ],
        }));

        // CloudFront actions scoped to gamma distribution
        cofounderUser.addToPolicy(new iam.PolicyStatement({
            sid: 'GammaCloudFrontDistribution',
            effect: iam.Effect.ALLOW,
            actions: [
                'cloudfront:CreateInvalidation',
                'cloudfront:GetInvalidation',
                'cloudfront:ListInvalidations',
                'cloudfront:GetDistribution',
                'cloudfront:GetDistributionConfig',
            ],
            resources: [
                `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
            ],
        }));

        // CloudFront actions that require wildcard resource
        cofounderUser.addToPolicy(new iam.PolicyStatement({
            sid: 'CloudFrontListAndDescribe',
            effect: iam.Effect.ALLOW,
            actions: [
                'cloudfront:ListDistributions',
                'cloudfront:ListTagsForResource',
            ],
            resources: ['*'],
        }));

        // Allow listing buckets (some tooling needs this)
        cofounderUser.addToPolicy(new iam.PolicyStatement({
            sid: 'ListBuckets',
            effect: iam.Effect.ALLOW,
            actions: ['s3:ListAllMyBuckets'],
            resources: ['*'],
        }));

        // ─── Outputs ─────────────────────────────────────────────────
        new cdk.CfnOutput(this, 'GammaDistributionDomainName', {
            value: distribution.distributionDomainName,
            description: 'Gamma CloudFront distribution domain name',
        });

        new cdk.CfnOutput(this, 'GammaSiteUrl', {
            value: `https://${gammaDomain}`,
            description: 'Gamma website URL',
        });

        new cdk.CfnOutput(this, 'GammaBucketName', {
            value: siteBucket.bucketName,
            description: 'Gamma S3 bucket name',
        });

        new cdk.CfnOutput(this, 'CofounderUserArn', {
            value: cofounderUser.userArn,
            description: 'Co-founder IAM user ARN — create access keys in AWS Console',
        });
    }
}

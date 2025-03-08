# Perseverance AI Website Deployment Guide

This guide will walk you through deploying the Perseverance AI website using AWS CDK.

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions.
2. **AWS CLI**: Make sure the AWS CLI is installed and configured.
3. **Node.js & npm**: Make sure Node.js (version 14+) and npm are installed.
4. **AWS CDK**: Ensure the AWS CDK is installed globally (`npm install -g aws-cdk`).
5. **Domain Registration**: Your domain (perseveranceai.com) should be registered.
6. **Route 53 Hosted Zone**: A hosted zone for your domain should be set up in Route 53.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd perseverance-ai-cdk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Copy Your Website Files

Place your website files in the `website` directory:
- `index.html` should be directly in the `website` directory
- CSS files should go in `website/assets/css/`
- Images should go in `website/assets/images/`

### 4. Configure the Stack

Edit `bin/perseverance-ai-cdk.ts` to set your domain and AWS environment details:

```typescript
new PerseveranceAiCdkStack(app, 'PerseveranceAiCdkStack', {
  env: { 
    account: 'your-account-id', 
    region: 'your-region' // e.g., 'us-east-1'
  },
  domainName: 'perseveranceai.com',
  siteSubDomain: 'www', // Or remove this line to use 'www' as default
});
```

### 5. Bootstrap Your AWS Environment (First Time Only)

```bash
cdk bootstrap
```

### 6. Deploy the Stack

```bash
npm run deploy
```

Or for production deployment with no manual approval:

```bash
npm run deploy:prod
```

### 7. Verify the Deployment

After deployment completes, you'll see outputs including:
- The S3 bucket name
- The CloudFront distribution domain name
- Your website URL (if Route 53 setup is complete)

Visit your website URL to confirm the deployment was successful.

## Making Changes

### To Update Website Content

1. Make changes to files in the `website` directory
2. Run `npm run deploy` to update the deployment

### To Update Infrastructure

1. Make changes to files in the `lib` directory
2. Run `npm run deploy` to update the deployment

## Cleaning Up

To remove all resources created by this stack:

```bash
npm run destroy
```

## Troubleshooting

### Certificate Validation Issues

If DNS validation for your SSL certificate fails:
1. Check that your Route 53 hosted zone is properly set up
2. Ensure the domain name is correctly specified in your CDK app
3. Try running the deployment again

### CloudFront Distribution Issues

If your CloudFront distribution isn't serving content correctly:
1. Check that the S3 bucket policy allows access from the CloudFront origin access identity
2. Verify that your index.html file is at the root of the website directory
3. Try invalidating the CloudFront cache: `aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"`

### Domain Name Issues

If your custom domain isn't working:
1. Check the Route 53 A record created by the CDK stack
2. Verify that your domain's DNS servers are pointing to the Route 53 name servers
3. Give DNS propagation time to complete (up to 48 hours in some cases)
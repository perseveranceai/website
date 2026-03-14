#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PerseveranceAiCdkStack } from '../lib/perseverance-ai-cdk-stack';
import { PerseveranceAiGammaStack } from '../lib/perseverance-ai-gamma-stack';

const app = new cdk.App();
new PerseveranceAiCdkStack(app, 'PerseveranceAiCdkStack', {
  // Specify the environment explicitly with your account ID and region
  env: {
    account: '951411676525',
    region: 'us-east-1'
  },

  /* Your domain name, matching your Route 53 hosted zone */
  domainName: 'perseveranceai.com',
  siteSubDomain: 'www', // Optional, default is 'www'

  /* Email address to receive lead notifications */
  adminEmail: 'pdr.perseverance@gmail.com', // Replace with your actual Gmail

  /* Add other stack props as needed */
  tags: {
    Environment: 'dev',
    Project: 'PerseveranceAI',
  },
});

// Gamma (staging) environment — separate stack for co-founder testing
new PerseveranceAiGammaStack(app, 'PerseveranceAiGammaStack', {
  env: {
    account: '951411676525',
    region: 'us-east-1',
  },
  domainName: 'perseveranceai.com',
  tags: {
    Environment: 'gamma',
    Project: 'PerseveranceAI',
  },
});
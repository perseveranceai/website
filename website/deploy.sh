#!/bin/bash

# Deployment script for Perseverance AI website
# Uploads files to S3 and invalidates CloudFront cache

set -e  # Exit on error

# Configuration
S3_BUCKET="www.perseveranceai.com"
CLOUDFRONT_DIST_ID="E274OKID4GUQ1J"
WEBSITE_URL="https://www.perseveranceai.com"

echo "======================================"
echo "Deploying Perseverance AI Website"
echo "======================================"
echo ""

# Upload all files to S3
echo "📦 Uploading files to S3 bucket: $S3_BUCKET"
aws s3 sync . s3://$S3_BUCKET/ \
  --exclude ".git/*" \
  --exclude ".gitignore" \
  --exclude "deploy.sh" \
  --exclude "copy-doc/*" \
  --exclude "README.md" \
  --exclude ".DS_Store" \
  --delete

echo ""
echo "✅ Files uploaded successfully"
echo ""

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DIST_ID \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo "✅ Cache invalidation created: $INVALIDATION_ID"
echo ""

echo "======================================"
echo "✨ Deployment Complete!"
echo "======================================"
echo ""
echo "Your website will be live at $WEBSITE_URL in 1-3 minutes"
echo ""
echo "To check invalidation status:"
echo "aws cloudfront get-invalidation --distribution-id $CLOUDFRONT_DIST_ID --id $INVALIDATION_ID"
echo ""

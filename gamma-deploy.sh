#!/bin/bash
set -e

# Configuration — Gamma Environment
BUCKET_NAME="gamma.perseveranceai.com"
DISTRIBUTION_ALIAS="gamma.perseveranceai.com"
REGION="us-east-1"

echo "🚀 Starting Gamma Deploy..."

# 1. Sync files to S3
echo "📦 Syncing files to s3://${BUCKET_NAME}..."
aws s3 sync website/ s3://${BUCKET_NAME} --delete
echo "✅ S3 Sync Complete"

# 2. Invalidate CloudFront
echo "🔄 Invalidating CloudFront cache..."
# Find Distribution ID by alias
DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items!=null] | [?contains(Aliases.Items, '${DISTRIBUTION_ALIAS}')].Id | [0]" --output text)

if [ "$DIST_ID" == "None" ] || [ -z "$DIST_ID" ]; then
    echo "❌ Could not find CloudFront Distribution for ${DISTRIBUTION_ALIAS}"
    exit 1
fi

echo "   Distribution ID: ${DIST_ID}"
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id ${DIST_ID} --paths "/*" --query "Invalidation.Id" --output text)
echo "✅ Invalidation started: ${INVALIDATION_ID}"

echo "🎉 Gamma Deploy Complete! Site will be live at https://gamma.perseveranceai.com in 1-3 minutes"

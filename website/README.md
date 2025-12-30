# Perseverance AI Website

Product website for Perseverance AI and Lensy documentation analysis tool.

## Live Site

https://www.perseveranceai.com

## Deployment

### Prerequisites

- AWS CLI configured with appropriate credentials
- Access to the `www.perseveranceai.com` S3 bucket
- Access to CloudFront distribution `E274OKID4GUQ1J`

### Deploy to Production

Simply run the deployment script:

```bash
./deploy.sh
```

This script will:
1. Upload all website files to the S3 bucket
2. Invalidate the CloudFront cache
3. Display the deployment status

The website will be live in 1-3 minutes after the script completes.

### Manual Deployment

If you need to deploy manually:

```bash
# Upload files to S3
aws s3 sync . s3://www.perseveranceai.com/ --exclude ".git/*" --exclude "deploy.sh" --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E274OKID4GUQ1J --paths "/*"
```

## Local Development

### Preview Locally

Start a simple HTTP server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000 in your browser.

## Repository

https://github.com/perseveranceai/website

## Structure

```
.
├── index.html              # Main homepage
├── assets/
│   └── js/
│       └── contact-form.js # Contact form handler
├── copy-doc/               # Copy documentation (not deployed)
├── deploy.sh               # Deployment script
└── README.md               # This file
```

## Contact Form

The contact form submits to a backend handler located at `/assets/js/contact-form.js`.

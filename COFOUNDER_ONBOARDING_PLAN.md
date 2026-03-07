# Co-founder Onboarding Plan

## Context
Onboard a non-technical co-founder to make website changes using Claude Code on a **gamma (staging) environment** (`gamma.perseveranceai.com`), without risking the production site. The website is a static HTML/CSS/JS site deployed via AWS CDK to S3 + CloudFront.

---

## Part 1: What YOU (founder) need to do

### 1A. Create the Gamma CDK Stack
Duplicate the existing production stack as a gamma stack so your co-founder deploys to a separate S3 bucket + CloudFront distribution.

**File: `bin/perseverance-ai-cdk.ts`** — Add a second stack instantiation:

```ts
new PerseveranceAiCdkStack(app, 'PerseveranceAiGammaStack', {
  env: { account: '951411676525', region: 'us-east-1' },
  domainName: 'perseveranceai.com',
  siteSubDomain: 'gamma',
  adminEmail: 'pdr.perseverance@gmail.com',
  tags: { Environment: 'gamma', Project: 'PerseveranceAI' },
});
```

Then deploy it: `npx cdk deploy PerseveranceAiGammaStack`

This creates:
- S3 bucket: `gamma.perseveranceai.com`
- CloudFront distribution for gamma
- Route 53 record: `gamma.perseveranceai.com`
- Separate API Gateway, Lambda, DynamoDB for gamma (isolated from prod)

**Note:** The existing stack hardcodes the S3 bucket name as `www.perseveranceai.com`. The gamma stack will use `gamma.perseveranceai.com` automatically since it's derived from `siteSubDomain + domainName`. However, some CDK resource IDs (like OAI comment, etc.) are shared — review for conflicts. The stack should work as-is since each stack gets its own resource IDs.

### 1B. Create an IAM User for the Co-founder
In AWS Console (`951411676525`):

1. Go to **IAM > Users > Create User**
   - Username: `cofounder-gamma` (or their name)
   - Enable **programmatic access** (Access Key + Secret Key for CLI)
   - Do NOT give console access unless needed

2. **Create a custom IAM policy** — scoped to gamma resources only:
   ```
   - s3:PutObject, s3:GetObject, s3:DeleteObject, s3:ListBucket on gamma.perseveranceai.com bucket
   - cloudfront:CreateInvalidation on the gamma distribution
   - (Optional) cloudformation/cdk permissions if you want them to run cdk deploy
   ```

3. **Simpler alternative**: Create an IAM policy that allows:
   - Full S3 access to `gamma.perseveranceai.com` bucket only
   - CloudFront invalidation on the gamma distribution only
   - No access to prod bucket, DynamoDB, Lambda, SES, or other services

4. Hand the co-founder the Access Key ID + Secret Access Key securely (e.g., 1Password, not email/Slack)

### 1C. Create a Fast-Deploy Script for Gamma
Create `gamma-deploy.sh` (similar to existing `fast-deploy.sh`):

```bash
#!/bin/bash
GAMMA_BUCKET="gamma.perseveranceai.com"
GAMMA_CF_DIST_ID="<gamma-distribution-id>"  # Get this after deploying gamma stack

aws s3 sync website/ s3://$GAMMA_BUCKET --delete
aws cloudfront create-invalidation --distribution-id $GAMMA_CF_DIST_ID --paths "/*"
echo "Gamma deployed! Check https://gamma.perseveranceai.com"
```

This is the only deploy command your co-founder needs. No CDK, no build step — just sync static files.

### 1D. Set Up Claude Code Access
- Ensure your co-founder has a Claude Code account/license
- Clone the repo on their machine or use Claude Code on the web
- Add a `CLAUDE.md` file to the repo with guardrails (see Part 3)

---

## Part 2: Guide for the Co-founder

*Share this section with them directly.*

### Getting Started

1. **Install AWS CLI** and configure it:
   ```
   aws configure
   ```
   Enter the Access Key ID and Secret Access Key you were given. Region: `us-east-1`.

2. **Clone the website repo** (you'll be given the GitHub URL and access).

3. **Open Claude Code** in the repo directory.

4. **Make changes**: Tell Claude Code what you want to change. The website files are in the `website/` folder:
   - `website/index.html` — Homepage
   - `website/about.html` — About page
   - `website/contact.html` — Contact page
   - `website/assets/css/styles.css` — Styling
   - `website/assets/images/` — Images

5. **Deploy to gamma** (staging): Run `./gamma-deploy.sh` to see your changes live at `gamma.perseveranceai.com`.

6. **Review** your changes at `https://gamma.perseveranceai.com` before asking to promote to production.

### Rules
- Only edit files inside the `website/` folder
- Do NOT touch files in `lib/`, `bin/`, `lambda/`, or `node_modules/`
- Always deploy to gamma first, never to production
- Ask your co-founder to review before promoting to prod

---

## Part 3: Add Guardrails via CLAUDE.md

Create a `CLAUDE.md` in the repo root with instructions for Claude Code:

```markdown
# Website Project Guidelines

## For gamma/staging work
- Only modify files in the `website/` directory (HTML, CSS, JS, images)
- Do NOT modify infrastructure files (lib/, bin/, lambda/, cdk.json, package.json)
- After making changes, deploy using: ./gamma-deploy.sh
- The staging site is at: https://gamma.perseveranceai.com
- The production site is at: https://www.perseveranceai.com — do NOT deploy to production

## Website structure
- index.html — Homepage
- about.html — About page
- contact.html — Contact page
- notices.html — Legal notices
- assets/css/styles.css — All styling
- assets/images/ — Image assets
```

---

## Part 4: Checklist Summary

| # | Task | Who |
|---|------|-----|
| 1 | Add gamma stack to `bin/perseverance-ai-cdk.ts` | You |
| 2 | Run `npx cdk deploy PerseveranceAiGammaStack` | You |
| 3 | Note the gamma CloudFront distribution ID from stack outputs | You |
| 4 | Create `gamma-deploy.sh` with the distribution ID | You |
| 5 | Create IAM user with scoped permissions (S3 gamma bucket + CF invalidation) | You |
| 6 | Share AWS credentials securely with co-founder | You |
| 7 | Add `CLAUDE.md` guardrails file to repo | You |
| 8 | Grant co-founder GitHub repo access | You |
| 9 | Co-founder installs AWS CLI + configures credentials | Co-founder |
| 10 | Co-founder clones repo, opens Claude Code, makes changes | Co-founder |
| 11 | Co-founder runs `./gamma-deploy.sh` to deploy to staging | Co-founder |

## Verification
- After deploying the gamma stack, visit `https://gamma.perseveranceai.com` to confirm it works
- Have the co-founder run `./gamma-deploy.sh` with their IAM credentials to confirm access works
- Make a small test change (e.g., change a heading) and verify it appears on gamma

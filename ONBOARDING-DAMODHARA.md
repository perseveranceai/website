# AWS Setup for Damodhara — PerseveranceAI Gamma Environment

## What You Have

You should have received a CSV file with your AWS **Access Key ID** and **Secret Access Key**.
These credentials are scoped to the **gamma** staging environment only (`gamma.perseveranceai.com`).

## Setup Instructions

### Option 1: Ask Claude Code to do it

Paste this to Claude Code (or Claude in terminal):

> I have an AWS credentials CSV file at `~/Downloads/<filename>.csv`. Please:
> 1. Read the CSV to get the Access Key ID and Secret Access Key
> 2. Add a `[perseverance-gamma]` profile to `~/.aws/credentials` with those keys
> 3. Add a `[profile perseverance-gamma]` section to `~/.aws/config` with `region = us-east-1` and `output = json`
> 4. Verify by running: `aws sts get-caller-identity --profile perseverance-gamma`
> 5. **Delete the CSV file** after setup is confirmed

### Option 2: Manual setup

1. **Create/edit `~/.aws/credentials`** and add:
   ```ini
   [perseverance-gamma]
   aws_access_key_id = <your-access-key-id>
   aws_secret_access_key = <your-secret-access-key>
   ```

2. **Create/edit `~/.aws/config`** and add:
   ```ini
   [profile perseverance-gamma]
   region = us-east-1
   output = json
   ```

3. **Verify** it works:
   ```bash
   aws sts get-caller-identity --profile perseverance-gamma
   ```
   You should see your user ARN: `arn:aws:iam::951411676525:user/damodhara`

4. **Delete the CSV file** — never leave credentials on disk.

## Deploying to Gamma

Once set up, deploy website changes to `gamma.perseveranceai.com`:

```bash
# From the repo root
AWS_PROFILE=perseverance-gamma ./gamma-deploy.sh
```

Or for the `website/` subfolder fast-deploy:
```bash
cd website
AWS_PROFILE=perseverance-gamma aws s3 sync . s3://gamma.perseveranceai.com --delete --exclude ".git/*" --exclude "node_modules/*"
```

## What You Can Access

| Permission | Scope |
|---|---|
| S3 read/write/delete/list | `gamma.perseveranceai.com` bucket only |
| CloudFront invalidation | Gamma distribution only |

> **Note:** You do **not** have access to the production site (`www.perseveranceai.com`).

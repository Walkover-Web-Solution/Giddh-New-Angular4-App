# Windows EXE Release Setup Guide

This guide explains how to set up automated Windows EXE builds with code signing and S3 deployment.

## Overview

The workflow automatically:
1. Builds Windows EXE when you push a git tag (v*.*.*)
2. Signs the EXE using SSL.com eSigner cloud signing
3. Uploads signed EXE to S3 with versioned paths

## Required GitHub Secrets

### SSL.com eSigner Secrets
```
ES_USERNAME=your_ssl_com_username
ES_PASSWORD=your_ssl_com_password  
ES_CREDENTIAL_ID=your_credential_id
ES_TOTP_SECRET=your_totp_secret
```

### AWS Secrets (Choose ONE option)

#### Option A: Access Keys (Simpler)
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
```

#### Option B: OIDC Role (More Secure)
```
AWS_ROLE_TO_ASSUME=arn:aws:iam::123456789012:role/GitHubActionsRole
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
```

## AWS Setup

### 1. Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name
```

### 2. Create IAM Policy
Use the policy in `aws-iam-policy.json` and replace `YOUR_BUCKET_NAME` with your actual bucket name.

### 3. Create IAM User/Role
- For Access Keys: Create IAM user and attach the policy
- For OIDC: Create IAM role with GitHub OIDC trust relationship

## Usage

### Trigger a Release
```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0
```

### Output Locations
- Versioned: `s3://your-bucket/releases/v1.0.0/app.exe`
- Latest: `s3://your-bucket/releases/latest/app.exe`

## Troubleshooting

### Common Issues
1. **Build fails**: Check `npm run dist -- --win --x64` works locally
2. **Signing fails**: Verify SSL.com credentials and TOTP secret
3. **S3 upload fails**: Check AWS credentials and bucket permissions
4. **No EXE found**: Verify electron-builder output directory is `dist/`

### Workflow Customization
- Change `UPLOAD_LATEST: "false"` to disable latest upload
- Modify build command in "Build Windows EXE" step
- Adjust EXE detection logic in PowerShell scripts

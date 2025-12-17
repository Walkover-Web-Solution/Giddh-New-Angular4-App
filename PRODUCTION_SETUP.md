# Production Server Setup Guide

## 🚀 Server Environment Variables Setup

For production deployment, set these environment variables on your server/hosting platform:

### Required Production Environment Variables

```bash
# Google OAuth (Production)
export GOOGLE_CLIENT_ID="641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="eWzLFEb_T9VrzFjgE40Bz6_l"

# Payment Gateway (Production)
export RAZORPAY_KEY="rzp_live_hB6lP01KB6b0u1"

# OTP Service
export OTP_WIDGET_ID="326a63733354393830313330"
export OTP_TOKEN_AUTH="205968TmXguUAwoD633af103P1"

# Social Login (Optional)
export TWITTER_CLIENT_ID="w64afk3ZflEsdFxd6jyB9wt5j"
export TWITTER_SECRET_KEY="62GfvL1A6FcSEJBPnw59pjVklVI4QqkvmA1uDEttNLbUl2ZRpy"
export LINKEDIN_CLIENT_ID="75urm0g3386r26"
export LINKEDIN_SECRET_KEY="3AJTvaKNOEG4ISJ0"

# Application Configuration
export ERRLYTIC_NEEDED="true"
export ERRLYTIC_KEY="your-production-errlytic-key"
export ENABLE_VOUCHER_ADJUSTMENT_MULTI_CURRENCY="true"
```

## 🔧 Platform-Specific Setup

### Vercel
```bash
# Add to Vercel environment variables
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add RAZORPAY_KEY production
# ... add all other variables
```

### Netlify
```bash
# Add to Netlify environment variables via dashboard or CLI
netlify env:set GOOGLE_CLIENT_ID "641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com"
netlify env:set GOOGLE_CLIENT_SECRET "eWzLFEb_T9VrzFjgE40Bz6_l"
netlify env:set RAZORPAY_KEY "rzp_live_hB6lP01KB6b0u1"
# ... add all other variables
```

### AWS/EC2
```bash
# Add to ~/.bashrc or /etc/environment
echo 'export GOOGLE_CLIENT_ID="641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com"' >> ~/.bashrc
echo 'export GOOGLE_CLIENT_SECRET="eWzLFEb_T9VrzFjgE40Bz6_l"' >> ~/.bashrc
echo 'export RAZORPAY_KEY="rzp_live_hB6lP01KB6b0u1"' >> ~/.bashrc
# ... add all other variables
source ~/.bashrc
```

### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

# Set production environment variables
ENV GOOGLE_CLIENT_ID="641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="eWzLFEb_T9VrzFjgE40Bz6_l"
ENV RAZORPAY_KEY="rzp_live_hB6lP01KB6b0u1"
ENV OTP_WIDGET_ID="326a63733354393830313330"
ENV OTP_TOKEN_AUTH="205968TmXguUAwoD633af103P1"

# Build application
COPY . .
RUN npm ci
RUN npm run build-prod
```

### GitHub Actions
```yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build production
        env:
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
          RAZORPAY_KEY: ${{ secrets.RAZORPAY_KEY }}
          OTP_WIDGET_ID: ${{ secrets.OTP_WIDGET_ID }}
          OTP_TOKEN_AUTH: ${{ secrets.OTP_TOKEN_AUTH }}
          TWITTER_CLIENT_ID: ${{ secrets.TWITTER_CLIENT_ID }}
          TWITTER_SECRET_KEY: ${{ secrets.TWITTER_SECRET_KEY }}
          LINKEDIN_CLIENT_ID: ${{ secrets.LINKEDIN_CLIENT_ID }}
          LINKEDIN_SECRET_KEY: ${{ secrets.LINKEDIN_SECRET_KEY }}
        run: npm run build-prod
```

## 🧪 Testing Production Build

### Local Testing with Production Variables
```bash
# Set production environment variables locally
export GOOGLE_CLIENT_ID="641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="eWzLFEb_T9VrzFjgE40Bz6_l"
export RAZORPAY_KEY="rzp_live_hB6lP01KB6b0u1"
export OTP_WIDGET_ID="326a63733354393830313330"
export OTP_TOKEN_AUTH="205968TmXguUAwoD633af103P1"

# Test production build
npm run build-prod

# Verify environment variables were loaded
cat apps/web-giddh/src/environments/environment.generated.ts
```

### Verify Build Output
The build script should show:
```
🔧 Building environment configuration for: prod
🔒 Production/CI environment detected - using server environment variables
🚫 Skipping .env file loading for security
✅ Environment build completed successfully!
```

## 🔐 Security Checklist

### Before Production Deployment
- [ ] All production environment variables set on server
- [ ] No .env files deployed to production server
- [ ] Production build tested with actual server variables
- [ ] All credentials rotated if previously exposed
- [ ] .env files confirmed in .gitignore
- [ ] No hardcoded credentials in source code

### Post-Deployment Verification
- [ ] Application loads correctly with production credentials
- [ ] Google OAuth works with production client ID
- [ ] Razorpay integration works with live key
- [ ] OTP service functions correctly
- [ ] Social login features work (if enabled)

## 🆘 Troubleshooting

### Build Issues
1. **"Environment variable not found"**
   - Verify all required variables are set on server
   - Check variable names match exactly (case-sensitive)
   - Restart server/deployment after setting variables

2. **"OAuth errors in production"**
   - Verify production Google Client ID is correct
   - Check OAuth redirect URLs are configured for production domain
   - Ensure production credentials are not test credentials

3. **"Payment gateway errors"**
   - Verify Razorpay live key is correct
   - Check webhook URLs are configured for production
   - Ensure live key has proper permissions

### Deployment Issues
1. **"Build succeeds but app doesn't work"**
   - Check browser console for errors
   - Verify environment.generated.ts contains correct values
   - Check network requests for API endpoints

2. **"Environment variables not loading"**
   - Verify CI=true or NODE_ENV=production is set
   - Check build logs for environment detection messages
   - Ensure server environment variables are properly set

## 📞 Support

For production deployment issues:
1. Check build logs for environment variable detection
2. Verify all required environment variables are set
3. Test locally with production environment variables
4. Contact development team for credential verification

---

**Remember: Never commit production credentials to any repository!**

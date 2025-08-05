# 🚀 FundBase Farcaster Mini App Integration

## Overview

FundBase is now configured as a Farcaster Mini App, allowing users to post startup ideas and get instant ETH backing directly within the Farcaster ecosystem.

## ✅ Configuration Complete

### 1. Redirect Configuration
- **File**: `vercel.json`
- **Status**: ✅ Configured
- **Redirect**: `/.well-known/farcaster.json` → `https://api.farcaster.xyz/miniapps/hosted-manifest/019879a0-0067-04d6-a803-d1003326d029`

### 2. Environment Variables
- **File**: `.env`
- **Status**: ✅ Updated
- **Production URL**: `https://basedfund.vercel.app`
- **Farcaster Credentials**: ✅ Populated

### 3. Required Images
- **Status**: ✅ All present in `/public/`
- `icon.png` - App icon
- `hero.png` - Hero image
- `splash.png` - Splash screen
- `logo.png` - Logo

## 🎯 Manifest Details

```json
{
  "frame": {
    "name": "FundBase",
    "version": "1",
    "iconUrl": "https://basedfund.vercel.app/icon.png",
    "homeUrl": "https://basedfund.vercel.app",
    "imageUrl": "https://basedfund.vercel.app/image.png",
    "splashImageUrl": "https://basedfund.vercel.app/splash.png",
    "splashBackgroundColor": "#6200EA",
    "webhookUrl": "https://basedfund.vercel.app/api/webhook",
    "subtitle": "a platform for founders",
    "description": "Post idea and get funded",
    "primaryCategory": "finance",
    "ogTitle": "FundBase"
  },
  "accountAssociation": {
    "header": "eyJmaWQiOjExNDMyNzcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgxQkViRDYxMTVkQjMyRDUyNkNlNDI3YUE3OGYxNmIxOGEzODAwREJhIn0",
    "payload": "eyJkb21haW4iOiJiYXNlZGZ1bmQudmVyY2VsLmFwcCJ9",
    "signature": "G04oUt/tAO80am/dNf28wNm+4MzNgPe/i/daGW5amAkuJUvqsJYhh/j/fZJNtBiP0qIE3pRQnGo8MUzSiRpG6xw="
  }
}
```

## 🚀 Deployment Steps

### Option 1: Using the Deployment Script
```bash
# Make the script executable
chmod +x scripts/deploy-to-vercel.js

# Run the deployment script
node scripts/deploy-to-vercel.js
```

### Option 2: Manual Vercel Deployment
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

### Option 3: GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy on push

## 🧪 Testing

### Test Farcaster Integration
```bash
# Run the comprehensive test suite
node scripts/test-farcaster-integration.js
```

### Manual Testing
1. **Test Redirect**: Visit `https://basedfund.vercel.app/.well-known/farcaster.json`
2. **Test App**: Visit `https://basedfund.vercel.app`
3. **Test Images**: Verify all images load correctly

## 📋 Pre-Deployment Checklist

- ✅ `vercel.json` redirect configured
- ✅ Environment variables set
- ✅ All required images in `/public/`
- ✅ Farcaster credentials populated
- ✅ Production URL updated
- ✅ App metadata configured

## 🔧 Environment Variables

### Required Variables
```bash
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=FundBase
NEXT_PUBLIC_URL=https://basedfund.vercel.app
NEXT_PUBLIC_ONCHAINKIT_API_KEY=2KFWyKyr1tA0qFvKQp5xLx2m14z0IyOJ
FARCASTER_HEADER=eyJmaWQiOjExNDMyNzcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgxQkViRDYxMTVkQjMyRDUyNkNlNDI3YUE3OGYxNmIxOGEzODAwREJhIn0
FARCASTER_PAYLOAD=eyJkb21haW4iOiJiYXNlZGZ1bmQudmVyY2VsLmFwcCJ9
FARCASTER_SIGNATURE=G04oUt/tAO80am/dNf28wNm+4MzNgPe/i/daGW5amAkuJUvqsJYhh/j/fZJNtBiP0qIE3pRQnGo8MUzSiRpG6xw=
```

### Optional Variables
```bash
NEXT_PUBLIC_APP_SUBTITLE=a platform for founders
NEXT_PUBLIC_APP_DESCRIPTION=Post idea and get funded
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR="#6200EA"
NEXT_PUBLIC_APP_PRIMARY_CATEGORY=finance
NEXT_PUBLIC_APP_TAGLINE=Post wild startup ideas and get instant ETH backing
NEXT_PUBLIC_APP_OG_TITLE=FundBase
NEXT_PUBLIC_APP_OG_DESCRIPTION=Post wild startup ideas and get instant ETH backing from the community
```

## 🌐 URLs

- **App URL**: https://basedfund.vercel.app
- **Farcaster Manifest**: https://api.farcaster.xyz/miniapps/hosted-manifest/019879a0-0067-04d6-a803-d1003326d029
- **Local Development**: http://localhost:3001

## 🎯 Features

### Core Functionality
- ✅ Post startup ideas
- ✅ Get instant ETH backing
- ✅ View idea backers
- ✅ Withdraw funds
- ✅ Multi-token support (ETH, USDC, etc.)

### Farcaster Integration
- ✅ Mini App frame metadata
- ✅ Account association
- ✅ Splash screen
- ✅ Webhook support
- ✅ Notification system

## 🔍 Troubleshooting

### Common Issues

1. **Redirect not working**
   - Check `vercel.json` configuration
   - Verify deployment includes the redirect

2. **Images not loading**
   - Ensure all images are in `/public/`
   - Check image URLs in environment variables

3. **Environment variables missing**
   - Run the deployment script to check variables
   - Verify all required variables are set in Vercel

4. **App not loading in Farcaster**
   - Test the manifest endpoint
   - Verify account association credentials

### Debug Commands
```bash
# Test redirect
curl -I https://basedfund.vercel.app/.well-known/farcaster.json

# Test manifest
curl https://api.farcaster.xyz/miniapps/hosted-manifest/019879a0-0067-04d6-a803-d1003326d029

# Test app accessibility
curl -I https://basedfund.vercel.app
```

## 📈 Next Steps

1. **Deploy to Production**
   ```bash
   node scripts/deploy-to-vercel.js
   ```

2. **Test Integration**
   ```bash
   node scripts/test-farcaster-integration.js
   ```

3. **Share on Farcaster**
   - Share your app URL: https://basedfund.vercel.app
   - Test Mini App functionality in Farcaster

4. **Monitor & Iterate**
   - Monitor user engagement
   - Collect feedback
   - Iterate on features

## 🎉 Success!

Your FundBase Mini App is now ready for Farcaster integration! Users can discover and use your app directly within the Farcaster ecosystem to post startup ideas and get instant ETH backing.

---

**Status**: ✅ **READY FOR DEPLOYMENT** - All configuration is complete and ready for production deployment to Vercel. 
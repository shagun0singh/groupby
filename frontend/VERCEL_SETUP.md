# Vercel Environment Variables Setup

## Add these environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

### Required Variables:

**NEXT_PUBLIC_GOOGLE_CLIENT_ID**
- Value: Your Google OAuth Client ID
- Environment: Production, Preview, Development

**NEXT_PUBLIC_API_URL**
- Value: Your backend API URL (e.g., https://your-backend.herokuapp.com or https://your-backend.com)
- Environment: Production, Preview, Development

### Optional Variables (for image uploads):

**NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**
- Value: Your Cloudinary cloud name
- Environment: Production, Preview, Development

**NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET**
- Value: Your Cloudinary upload preset
- Environment: Production, Preview, Development

## After adding variables:

1. Go to Deployments tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"

Or push a new commit to trigger a new deployment.

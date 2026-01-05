# Google OAuth Setup - Complete Guide

## Part 1: Create OAuth Client in Google Cloud Console

### A. Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with: shagun.singh2024@nst.rishihood.edu.in

### B. Create or Select a Project
1. Click the project dropdown at the top (next to "Google Cloud")
2. Click "NEW PROJECT" (or select existing project if you have one)
3. Name it: "GroupBy" or "GroupBy Auth"
4. Click "CREATE"
5. Wait for it to be created, then SELECT it

### C. Enable Google+ API (Required!)
1. Go to: https://console.cloud.google.com/apis/library
2. Search for: "Google+ API"
3. Click on "Google+ API"
4. Click "ENABLE"
5. Wait for it to enable

### D. Configure OAuth Consent Screen (IMPORTANT!)
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Choose "External" (unless you have Google Workspace)
3. Click "CREATE"

**Fill in the form:**
- App name: `GroupBy`
- User support email: `shagun.singh2024@nst.rishihood.edu.in`
- App logo: (optional, skip for now)
- App domain: (optional, skip for now)
- Developer contact: `shagun.singh2024@nst.rishihood.edu.in`
4. Click "SAVE AND CONTINUE"

**Scopes page:**
- Click "ADD OR REMOVE SCOPES"
- Select these scopes:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `openid`
- Click "UPDATE"
- Click "SAVE AND CONTINUE"

**Test users page:**
- Click "ADD USERS"
- Add your email: `shagun.singh2024@nst.rishihood.edu.in`
- Add any other emails you want to test with
- Click "SAVE AND CONTINUE"

**Summary:**
- Review and click "BACK TO DASHBOARD"

---

## Part 2: Create OAuth 2.0 Client ID

### E. Create Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "+ CREATE CREDENTIALS" at the top
3. Select "OAuth client ID"
4. If prompted to configure consent screen, do Part D first

**Application type:** Choose "Web application"

**Name:** `GroupBy Web Client`

**Authorized JavaScript origins:**
Click "+ ADD URI" and add these ONE BY ONE:
1. `http://localhost:3000`
2. `https://YOUR-VERCEL-URL.vercel.app`
   (Replace with your ACTUAL Vercel URL - example: https://groupby-abc123.vercel.app)

**Authorized redirect URIs:**
- Leave EMPTY (not needed for this setup)

5. Click "CREATE"

### F. Copy Your Client ID
- A popup will show with your credentials
- **Copy the "Client ID"** (looks like: 123456789-abc123xyz.apps.googleusercontent.com)
- Click "OK"

---

## Part 3: Add Client ID to Vercel

### G. Add to Vercel Environment Variables
1. Go to: https://vercel.com/dashboard
2. Click on your "groupby" project
3. Go to Settings → Environment Variables
4. Find `NEXT_PUBLIC_GOOGLE_CLIENT_ID` variable
   - If it exists, click "Edit" and update the value
   - If not, click "Add New" and create it

**Key:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
**Value:** (paste the Client ID you just copied)
**Environments:** Check Production, Preview, Development

5. Click "Save"

### H. Redeploy
1. Go to "Deployments" tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

---

## Part 4: Test

1. Visit your Vercel URL
2. Go to the login page
3. Click "Continue with Google"
4. You should see a Google login popup
5. Sign in with: shagun.singh2024@nst.rishihood.edu.in

---

## Troubleshooting

**If you still get "OAuth client was not found":**
- Double-check the Client ID in Vercel matches exactly
- Make sure you enabled Google+ API
- Make sure your Vercel URL is in the Authorized JavaScript origins
- Try creating a NEW OAuth client and use that Client ID instead

**If you get "Access blocked: This app isn't verified":**
- Click "Advanced" → "Go to GroupBy (unsafe)"
- This is normal for apps in development/testing mode

**If you get "Error 400: redirect_uri_mismatch":**
- Your authorized JavaScript origins need to match your Vercel URL exactly
- Check for http vs https
- Check for trailing slashes

---

## Quick Checklist
- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Configured OAuth Consent Screen (External)
- [ ] Added test user (your email)
- [ ] Created OAuth 2.0 Client ID
- [ ] Added localhost:3000 to authorized origins
- [ ] Added Vercel URL to authorized origins
- [ ] Copied Client ID
- [ ] Added Client ID to Vercel environment variables
- [ ] Redeployed on Vercel


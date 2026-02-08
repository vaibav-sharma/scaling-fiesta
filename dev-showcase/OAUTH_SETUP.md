# Google OAuth Setup Guide

## Prerequisites

1. **Google Cloud Project Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web Application type)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://yourdomain.com/api/auth/google/callback`

2. **Get Credentials**
   - Copy `Client ID` and `Client Secret`

## Installation

```bash
npm install next-auth google-auth-library
# or
yarn add next-auth google-auth-library
```

## Environment Variables

Create `.env.local`:
```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=http://localhost:3000  # or your production URL
NEXTAUTH_SECRET=generate_random_string  # openssl rand -base64 32
```

## Files to Create

1. `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
2. Update `src/store/authStore.ts` - Add OAuth methods
3. Update `app/login/page.tsx` - Add Google Sign-in button
4. Create `src/components/ui/GoogleSignInButton.tsx` - Button component

## Verification

After setup, user flow will be:
1. Click "Sign in with Google"
2. Redirected to Google consent screen
3. User authorizes
4. Redirected back with auth token
5. Automatically logged in & redirected to dashboard

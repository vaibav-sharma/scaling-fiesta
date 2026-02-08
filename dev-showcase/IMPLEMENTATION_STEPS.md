# OAuth Implementation Checklist & Steps

## Phase 1: Setup (30 mins)

### 1.1 Google Cloud Configuration
- [ ] Create Google Cloud Project at https://console.cloud.google.com
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials:
  - [ ] Type: Web Application
  - [ ] Authorized redirect URIs:
    ```
    http://localhost:3000/api/auth/callback/google
    https://yourdomain.com/api/auth/callback/google
    ```
- [ ] Copy Client ID and Client Secret

### 1.2 Install Dependencies
```bash
npm install next-auth@latest next-auth/providers google-auth-library
npm install --save-dev @types/next-auth
```

### 1.3 Environment Variables
Create `.env.local` in dev-showcase root:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)  # Generate with: openssl rand -base64 32
NEXT_PUBLIC_API_BASE_URL=your_backend_url
```

---

## Phase 2: Frontend Implementation (45 mins)

### 2.1 Create NextAuth Configuration
- [x] File created: `app/api/auth/[...nextauth]/route.ts`
  - Contains Google OAuth provider setup
  - Includes JWT callbacks
  - Has backend verification

### 2.2 Create OAuth Store (Zustand)
- [x] File created: `src/store/oauthStore.ts`
  - Manages OAuth state
  - Handles sign-in/sign-out

### 2.3 Create Google Sign-In Button
- [x] File created: `src/components/GoogleSignInButton.tsx`
  - Styled Google button with icon
  - Handles loading states
  - Error handling

### 2.4 Update Login Page
- [x] File created: `app/login/page-oauth-enabled.tsx`
  - Integrate GoogleSignInButton
  - Add OAuth error handling
  - Keep existing email/password option
  - Copy this to `app/login/page.tsx` when ready

### 2.5 Add SessionProvider to Layout
Update `app/layout.tsx`:
```tsx
import { SessionProvider } from "next-auth/react"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

---

## Phase 3: Backend Implementation (1 hour)

### 3.1 Backend Routes
Create these endpoints in your backend:

**POST /auth/oauth-callback**
- Receive OAuth user data from NextAuth
- Create/update user in database
- Return JWT token
- See: `BACKEND_OAUTH_GUIDE.py`

**POST /auth/verify-token** (optional)
- Verify Google ID token
- Return user profile

**POST /auth/logout** (optional)
- Revoke token
- Clear session

### 3.2 Database Schema Update
Add to User model:
```python
# Pseudo-code
class User(Base):
    # ... existing fields
    google_id: str = Column(String, unique=True, nullable=True)
    oauth_provider: str = Column(String, nullable=True)  # "google", "github"
    is_oauth_user: bool = Column(Boolean, default=False)
    picture_url: str = Column(String, nullable=True)
```

### 3.3 Environment Variables (Backend)
```env
GOOGLE_CLIENT_ID=from_google_cloud_console
GOOGLE_CLIENT_SECRET=from_google_cloud_console
JWT_SECRET=generate_new_secret
DATABASE_URL=your_database
```

---

## Phase 4: Testing (30 mins)

### 4.1 Local Testing
```bash
# Terminal 1: Start frontend
cd dev-showcase
npm run dev
# Visit http://localhost:3000/login

# Terminal 2: Start backend
# Your backend dev server

# Click "Sign in with Google"
# You should be redirected to Google login
# After authorization, should redirect to dashboard
```

### 4.2 Test Scenarios
- [ ] Google sign-in flow works
- [ ] User data persists in database
- [ ] JWT token is created
- [ ] Session persists on page refresh
- [ ] Logout clears session
- [ ] Email/password login still works
- [ ] Guest access still works
- [ ] Error handling for invalid credentials

### 4.3 Debug Checklist
If sign-in fails:
- [ ] Check GOOGLE_CLIENT_ID in .env.local
- [ ] Check NEXTAUTH_SECRET is set
- [ ] Check NEXTAUTH_URL matches localhost:3000
- [ ] Check Google Cloud OAuth credentials
- [ ] Check browser console for errors
- [ ] Check NextAuth logs: `next-auth` in browser DevTools

---

## Phase 5: Production Deployment (1 hour)

### 5.1 Update Production URLs
In Google Cloud Console:
- Add production redirect URI:
  ```
  https://yourdomain.com/api/auth/callback/google
  https://yourdomain.com/api/auth/signin/google
  ```

### 5.2 Update Environment Variables
Set in your production hosting (Vercel, etc.):
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<production_secret>
GOOGLE_CLIENT_ID=<production_client_id>
GOOGLE_CLIENT_SECRET=<production_client_secret>
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### 5.3 Deploy
```bash
git add .
git commit -m "Add Google OAuth authentication"
git push  # Deploys to Vercel automatically if configured
```

### 5.4 Post-Deployment
- [ ] Test OAuth flow in production
- [ ] Monitor error logs
- [ ] Test user creation in database
- [ ] Verify session persistence
- [ ] Test logout functionality

---

## Optional Enhancements

### Add GitHub OAuth
1. Create GitHub OAuth app at https://github.com/settings/developers
2. Add provider to `route.ts`:
```tsx
GitHubProvider({
  clientId: process.env.GITHUB_ID || "",
  clientSecret: process.env.GITHUB_SECRET || "",
})
```

### Add Social Account Linking
- Allow existing users to link OAuth accounts
- Merge OAuth profiles with email accounts

### Add Profile Completion Flow
- Redirect new OAuth users to complete profile
- Ask for additional info (avatar, preferences)

### Rate Limiting
- Implement rate limiting on OAuth callback
- Prevent brute force attacks

### Audit Logging
- Log all OAuth sign-in attempts
- Track authentication source (Google, email, etc.)

---

## Files Created/Modified

✅ **Created:**
- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `src/components/GoogleSignInButton.tsx` - Google button component
- `src/store/oauthStore.ts` - OAuth state management
- `app/login/page-oauth-enabled.tsx` - Updated login page
- `app/login-oauth.html` - Mock HTML demo
- `OAUTH_SETUP.md` - Setup guide
- `BACKEND_OAUTH_GUIDE.py` - Backend implementation

📝 **To Modify:**
- `app/layout.tsx` - Add SessionProvider
- `app/login/page.tsx` - Replace with OAuth-enabled version
- `.env.local` - Add Google OAuth credentials
- Backend: Create `/auth/oauth-callback` endpoint

---

## Security Considerations

✅ **Already Handled by NextAuth:**
- PKCE (Proof Key for Code Exchange)
- CSRF protection
- Secure token storage
- State parameter validation
- Automatic token refresh

⚠️ **You Should Implement:**
- HTTPS only (production)
- Secure session storage
- Rate limiting
- Account enumeration protection
- Token revocation on logout
- Input validation on backend

---

## Support Resources

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [FastAPI OAuth Example](https://fastapi.tiangolo.com/advanced/security/oauth2-jwt/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

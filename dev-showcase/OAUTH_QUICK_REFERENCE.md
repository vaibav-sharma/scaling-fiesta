# OAuth Quick Reference Card

## 🚀 Get Started in 5 Minutes

```bash
# 1. Install
npm install next-auth next-auth/providers

# 2. Create .env.local with:
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=openssl_rand_-base64_32

# 3. NextAuth config exists at:
app/api/auth/[...nextauth]/route.ts ✅

# 4. Replace login page:
cp app/login/page-oauth-enabled.tsx app/login/page.tsx

# 5. Add to app/layout.tsx:
<SessionProvider>{children}</SessionProvider>

# 6. Test:
npm run dev
# Visit http://localhost:3000/login
```

---

## 📚 File Reference

| File | Does What |
|------|-----------|
| `route.ts` | NextAuth OAuth config |
| `GoogleSignInButton.tsx` | Sign-in button |
| `oauthStore.ts` | State management |
| `page-oauth-enabled.tsx` | Login page |
| `login-oauth.html` | Mock demo |

---

## 🔌 API Integration

### Frontend → NextAuth
```typescript
signIn('google', { redirect: true, callbackUrl: '/' })
```

### NextAuth → Google
```
GET https://accounts.google.com/o/oauth2/v2/auth?
  client_id=...&
  redirect_uri=http://localhost:3000/api/auth/callback/google&
  scope=openid profile email
```

### NextAuth → Your Backend
```javascript
POST /auth/oauth-callback
{
  email: "user@example.com",
  name: "User Name",
  googleId: "123456...",
  picture: "https://..."
}
```

### Your Backend → NextAuth
```json
{
  "success": true,
  "access_token": "jwt_token",
  "user": { "id", "email", "name" }
}
```

---

## 🔐 Security Checklist

- [x] PKCE enabled (NextAuth)
- [x] CSRF protection (NextAuth)
- [x] httpOnly cookies (NextAuth)
- [x] Token expiration (NextAuth)
- [ ] HTTPS in production
- [ ] Rate limiting (you add)
- [ ] Token revocation (you add)

---

## 🧪 Test Command

```bash
# Local test
curl -X POST http://localhost:8000/auth/oauth-callback \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "googleId": "123456",
    "picture": "https://..."
  }'
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| GOOGLE_CLIENT_ID error | Check `.env.local`, restart server |
| Redirect URI mismatch | Add exact URI to Google Cloud Console |
| Session not persisting | Add SessionProvider to layout |
| Token invalid | Regenerate NEXTAUTH_SECRET |
| User not in DB | Check `/auth/oauth-callback` is called |

---

## 📊 User Flow

```
Browser
  ↓ Click button
Google
  ↓ Login & authorize
NextAuth
  ↓ Exchange code
Backend
  ↓ Create user
DB
  ↓ Store user
Backend
  ↓ Return JWT
NextAuth
  ↓ Create session
App
  ↓ Redirect home
Dashboard (authenticated)
```

---

## 💾 Database Schema

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  oauth_provider VARCHAR(50),
  picture_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Key Concepts

| Concept | Meaning |
|---------|---------|
| **OAuth 2.0** | Industry-standard authentication protocol |
| **PKCE** | Security extension (Proof Key for Code Exchange) |
| **JWT** | JSON Web Token for session management |
| **httpOnly** | Cookie not accessible by JavaScript (secure) |
| **Callback URL** | Where Google redirects after auth |
| **ID Token** | Token from Google containing user info |
| **Access Token** | Token to call backend APIs |
| **Refresh Token** | Token to get new access token when expired |

---

## 🚦 Environment Variables

```env
# Required
GOOGLE_CLIENT_ID=<from Google Cloud>
GOOGLE_CLIENT_SECRET=<from Google Cloud>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>

# Optional
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
JWT_SECRET=<your backend JWT secret>
DATABASE_URL=<your database URL>
```

---

## 📱 Frontend Usage

```typescript
// Get session data
const { data: session } = useSession()

// Sign in
signIn('google', { callbackUrl: '/' })

// Sign out
signOut({ callbackUrl: '/login' })

// Protect page
if (!session) return <LoginPage />
```

---

## 🌐 Production Checklist

- [ ] Google Cloud: Add production redirect URIs
- [ ] Environment: Set NEXTAUTH_URL to production domain
- [ ] Security: Enable HTTPS
- [ ] Database: Run migrations
- [ ] Monitoring: Set up error logging
- [ ] Testing: Test complete OAuth flow
- [ ] Performance: Monitor auth endpoint latency

---

## 📞 Help Resources

- NextAuth Docs: https://next-auth.js.org/
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- JWT: https://jwt.io/
- See: IMPLEMENTATION_STEPS.md for detailed guide
- See: OAUTH_ARCHITECTURE.md for diagrams
- See: OAUTH_TESTING_GUIDE.md for test scenarios

---

**Last Updated:** December 29, 2024
**Status:** ✅ Ready to Implement

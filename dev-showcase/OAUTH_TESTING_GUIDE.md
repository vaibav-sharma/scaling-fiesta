# OAuth Testing & Mock Data Guide

## 🧪 Test Scenarios & Mock Data

### Test Account Credentials

Use these Google test accounts:

```
Test Account 1 (Admin User):
Email: test.admin@gmail.com
Password: TestPass123!@#
Expected: Full access to dashboard

Test Account 2 (Regular User):
Email: test.user@gmail.com
Password: TestPass456!@#
Expected: Limited access

Test Account 3 (New User):
Email: test.newuser@gmail.com
Password: TestPass789!@#
Expected: Create new user in DB, onboarding flow
```

---

## 🎭 Mock API Responses

### Successful OAuth Callback

**Request:**
```http
POST /auth/oauth-callback
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "googleId": "110234567890123456789",
  "picture": "https://lh3.googleusercontent.com/a/ACg..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 2592000,
  "user": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/a/ACg...",
    "oauth_provider": "google",
    "created_at": "2024-12-29T10:30:00Z"
  }
}
```

### User Already Exists

**Request:** (Same email, different googleId)
```json
{
  "email": "existing@example.com",
  "name": "Existing User",
  "googleId": "different_google_id_123",
  "picture": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGc...",
  "user": {
    "id": "user_existing123",
    "email": "existing@example.com",
    "name": "Existing User",
    "oauth_provider": "google"
  },
  "message": "User already exists, OAuth linked"
}
```

### Error: Invalid Token

**Response:**
```json
{
  "success": false,
  "error": "invalid_token",
  "message": "Token signature verification failed",
  "code": "INVALID_TOKEN"
}
```

### Error: Database Connection

**Response:**
```json
{
  "success": false,
  "error": "database_error",
  "message": "Failed to create user in database",
  "code": "DB_CONNECTION_ERROR"
}
```

---

## 🔐 JWT Token Examples

### Token Structure (3 parts separated by dots)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJ1c2VyXzEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsIm5hbWUiOiJKb2huIERvZSIsIm9hdXRoX3Byb3ZpZGVyIjoiZ29vZ2xlIiwiaWF0IjoxNzAzODMwNjAwLCJleHAiOjE3MDY0MjI2MDB9.
jR_MO-nQzE5W8pJ_qK9lX_5bZ2vK4mH6pL1nO9sT8rU
```

Breakdown:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "oauth_provider": "google",
  "iat": 1703830600,
  "exp": 1706422600
}
```

**Signature:** (Verified on backend with secret)

### Token Verification Test

```typescript
// Test JWT token verification
import jwt from 'jsonwebtoken'

const token = "eyJhbGciOiJIUzI1NiIs..." // from backend
const secret = process.env.JWT_SECRET

try {
  const decoded = jwt.verify(token, secret)
  console.log("Token valid:", decoded)
  // Output:
  // {
  //   sub: 'user_123',
  //   email: 'user@example.com',
  //   name: 'John Doe',
  //   oauth_provider: 'google',
  //   iat: 1703830600,
  //   exp: 1706422600
  // }
} catch (error) {
  console.error("Token invalid:", error.message)
}
```

---

## 🌐 Mock HTML Testing

### View Mock Login Page

1. Open `app/login-oauth.html` in a browser
2. Try clicking different buttons:
   - "Sign in with Google" (simulated)
   - "Sign in with GitHub" (simulated)
   - "Continue as Guest" (simulated)
3. See animations and loading states

### Simulate User Data

```javascript
// In browser console while on mock page:
const mockUser = {
  email: "user@example.com",
  name: "Test User",
  picture: "https://example.com/avatar.jpg",
  oauth_provider: "google",
  created_at: new Date().toISOString()
}

localStorage.setItem('mockUser', JSON.stringify(mockUser))
```

---

## 🧩 End-to-End Test Flow

### Test 1: New User Sign-in

```
Step 1: User clicks "Sign in with Google"
        └─> Browser redirects to Google

Step 2: User logs in with Google account
        └─> Google asks for permission
        └─> User clicks "Allow"

Step 3: Google redirects back with code
        └─> NextAuth receives code
        └─> Exchanges code for ID token

Step 4: Backend /auth/oauth-callback is called
        Payload: {
          email: "newuser@example.com",
          name: "New User",
          googleId: "123456..."
        }

Step 5: Backend creates new user
        INSERT INTO users (email, name, google_id, ...)
        └─> User ID: user_new123

Step 6: Backend generates JWT
        {
          sub: "user_new123",
          email: "newuser@example.com",
          oauth_provider: "google"
        }

Step 7: Frontend receives JWT
        └─> Stores in httpOnly cookie
        └─> Session created

Step 8: Frontend redirects to /
        └─> Dashboard loads
        └─> User is authenticated
        └─> Can access protected resources

✅ TEST PASSED: New user created and authenticated
```

### Test 2: Existing User Sign-in

```
Step 1-3: Same as above

Step 4: Backend /auth/oauth-callback is called
        Payload: {
          email: "existing@example.com",
          name: "Existing User",
          googleId: "new_google_id..."
        }

Step 5: Backend queries database
        SELECT * FROM users WHERE email = "existing@example.com"
        └─> User found (user_existing123)

Step 6: Backend updates user
        UPDATE users SET google_id = "new_google_id..." 
        WHERE id = "user_existing123"

Step 7: Backend generates JWT with existing user_id
        {
          sub: "user_existing123",
          email: "existing@example.com",
          oauth_provider: "google"
        }

Step 8-9: Same as above

✅ TEST PASSED: Existing user authenticated and updated
```

### Test 3: Session Persistence

```
Step 1: User logs in via OAuth
        └─> Session created
        └─> Cookie set

Step 2: Page refresh (F5)
        └─> Cookie sent to backend
        └─> useSession() hook verifies session
        └─> User still logged in

Step 3: Visit different page
        └─> useSession() checks session
        └─> No re-login required
        └─> Can access protected pages

✅ TEST PASSED: Session persists across page navigation
```

### Test 4: Logout

```
Step 1: User clicks logout
        └─> signOut() is called

Step 2: NextAuth clears session
        └─> httpOnly cookie deleted
        └─> (Optional) token added to revocation list

Step 3: User redirected to /login
        └─> useSession() returns null
        └─> Unauthenticated

Step 4: Try to access protected page
        └─> Middleware redirects to login
        └─> User must login again

✅ TEST PASSED: Logout works correctly
```

### Test 5: Token Expiration

```
Step 1: Token issued with exp: 1706422600 (30 days)

Step 2: Time passes (simulate with backend test)
        └─> Current time > exp

Step 3: User makes request
        └─> Backend checks exp > now
        └─> Token is expired

Step 4: NextAuth checks for refresh_token
        └─> If available: Exchanges for new token
        └─> If not: Redirect to login

Step 5: Either way, user gets new session
        └─> Or redirected to login

✅ TEST PASSED: Token expiration handled correctly
```

---

## 🛠️ Debug Helpers

### Backend Testing Script

```python
# test_oauth.py
import requests
import json

# Test OAuth callback endpoint
def test_oauth_callback():
    url = "http://localhost:8000/auth/oauth-callback"
    
    payload = {
        "email": "test@example.com",
        "name": "Test User",
        "googleId": "123456789",
        "picture": "https://example.com/avatar.jpg"
    }
    
    response = requests.post(url, json=payload)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"\nToken: {token}")
        
        # Verify token
        import jwt
        decoded = jwt.decode(token, options={"verify_signature": False})
        print(f"Decoded: {json.dumps(decoded, indent=2)}")

if __name__ == "__main__":
    test_oauth_callback()
```

### Frontend Testing Script

```typescript
// test-oauth.ts
import { signIn } from "next-auth/react"

export async function testGoogleSignIn() {
  console.log("Testing Google Sign-in...")
  
  try {
    const result = await signIn("google", {
      redirect: false,
    })
    
    console.log("Sign-in result:", result)
    
    if (result?.ok) {
      console.log("✅ Sign-in successful!")
    } else {
      console.error("❌ Sign-in failed:", result?.error)
    }
  } catch (error) {
    console.error("❌ Sign-in error:", error)
  }
}

// Run in browser console:
// testGoogleSignIn()
```

---

## 📊 Database Test Queries

### Check User Created

```sql
-- PostgreSQL
SELECT * FROM users WHERE email = 'test@example.com';

-- Expected result:
-- id      | email              | name       | google_id        | oauth_provider | picture_url
-- user_1  | test@example.com   | Test User  | 123456789...     | google         | https://...
```

### Check OAuth Fields

```sql
-- Verify all OAuth users
SELECT 
  id,
  email,
  name,
  google_id,
  oauth_provider,
  created_at,
  updated_at
FROM users
WHERE oauth_provider = 'google'
ORDER BY created_at DESC;
```

### Count OAuth vs Email Users

```sql
-- See OAuth adoption
SELECT 
  oauth_provider,
  COUNT(*) as count
FROM users
WHERE oauth_provider IS NOT NULL
GROUP BY oauth_provider
UNION ALL
SELECT 
  'email_only' as oauth_provider,
  COUNT(*) as count
FROM users
WHERE oauth_provider IS NULL;
```

---

## ✅ Test Checklist

- [ ] Google OAuth credentials obtained
- [ ] Environment variables configured
- [ ] NextAuth route created
- [ ] Google Sign-in button renders
- [ ] Clicking button redirects to Google
- [ ] Can log in with Google account
- [ ] User created in database
- [ ] JWT token generated
- [ ] Session persists on refresh
- [ ] Can access protected pages
- [ ] Logout clears session
- [ ] Email/password login still works
- [ ] Guest access still works
- [ ] Error handling works
- [ ] Existing users can OAuth link
- [ ] Production environment ready

---

## 🚨 Common Test Issues

### Issue: "User created twice"
```
Symptom: Same email appears twice in database
Reason: OAuth callback called twice
Fix: Add unique constraint on email
     ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE(email);
```

### Issue: "Session not persisting"
```
Symptom: User logged out after refresh
Reason: SessionProvider missing in layout
Fix: Add SessionProvider to app/layout.tsx
     <SessionProvider>{children}</SessionProvider>
```

### Issue: "Token always invalid"
```
Symptom: Every token verification fails
Reason: JWT_SECRET mismatch between frontend and backend
Fix: Use same NEXTAUTH_SECRET on frontend
     Verify backend uses same JWT_SECRET
```

### Issue: "Google always shows consent screen"
```
Symptom: Every login shows permission prompt
Reason: Scopes not cached or user revoking
Fix: Add access_type=offline for refresh tokens
     User can also revoke in Google settings
```

# OAuth Flow Diagram & Architecture

## 1. Complete OAuth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Clicks "Sign in with Google"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              YOUR FRONTEND (Next.js App)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app/login/page.tsx                                      │  │
│  │  - Shows login form with Google button                   │  │
│  │  - User clicks button                                    │  │
│  │  - Calls: signIn('google', { callbackUrl: '/' })        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 2. Redirects to Google OAuth
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE OAUTH SERVER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  accounts.google.com/oauth/authorize                     │  │
│  │  - Shows Google login screen                             │  │
│  │  - User logs in with Google account                      │  │
│  │  - User gives permission                                 │  │
│  │  - Google generates authorization code                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 3. Redirects back with code
                              │    ?code=...&state=...
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              YOUR FRONTEND (NextAuth.js)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app/api/auth/[...nextauth]/route.ts                     │  │
│  │  - Receives authorization code                           │  │
│  │  - Exchanges code for ID Token (server-side)             │  │
│  │  - Verifies token signature                              │  │
│  │  - Extracts user data (email, name, picture)             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 4. Calls oauth-callback endpoint
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               YOUR BACKEND (FastAPI/Django)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  POST /auth/oauth-callback                               │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ 1. Receive: {email, name, googleId, picture}        │ │  │
│  │  │ 2. Query: User exists by email?                     │ │  │
│  │  │    - Yes: Update OAuth fields                       │ │  │
│  │  │    - No: Create new user                            │ │  │
│  │  │ 3. Generate JWT token                               │ │  │
│  │  │ 4. Return: {access_token, user_data}                │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  DATABASE: User table                                      │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ id | email | name | google_id | picture | ...      │ │  │
│  │  │ 1  | user@..| User | 123456... | url    | ...      │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 5. Returns JWT token
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              YOUR FRONTEND (NextAuth.js)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Creates secure session with JWT                         │  │
│  │  Stores in httpOnly cookie (secure)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 6. Redirect to app
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              USER DASHBOARD (Protected)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  useSession() hook gives access to user data             │  │
│  │  Authenticated API calls include JWT token               │  │
│  │  User can access protected resources                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Components

```
┌──────────────────────────────────────────────────────────────────┐
│                  YOUR APPLICATION STACK                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TIER 1: CLIENT (Browser)                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ app/login/page.tsx                                         │ │
│  │ - GoogleSignInButton component                             │ │
│  │ - Calls: signIn('google')                                  │ │
│  │ - Handles OAuth state & errors                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ▲                                       │
│                          │ Uses                                  │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ src/store/oauthStore.ts (Zustand)                          │ │
│  │ - OAuth loading state                                      │ │
│  │ - Error handling                                           │ │
│  │ - OAuth provider abstraction                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ▲                                       │
│                          │                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TIER 2: NEXTAUTH API LAYER (app/api/auth/*)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ app/api/auth/[...nextauth]/route.ts                        │ │
│  │ ┌──────────────────────────────────────────────────────┐  │ │
│  │ │ Providers:                                           │  │ │
│  │ │ - GoogleProvider (clientId, clientSecret)           │  │ │
│  │ │ - Can add GitHubProvider, CredentialsProvider, etc  │  │ │
│  │ └──────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │ ┌──────────────────────────────────────────────────────┐  │ │
│  │ │ Callbacks:                                           │  │ │
│  │ │ - jwt: Store tokens in JWT                           │  │ │
│  │ │ - session: Add data to user session                  │  │ │
│  │ │ - signIn: Validate user before creation              │  │ │
│  │ │ - redirect: Handle post-login redirect               │  │ │
│  │ └──────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │ ┌──────────────────────────────────────────────────────┐  │ │
│  │ │ Endpoints created automatically:                     │  │ │
│  │ │ - /api/auth/signin/google                            │  │ │
│  │ │ - /api/auth/callback/google                          │  │ │
│  │ │ - /api/auth/signout                                  │  │ │
│  │ │ - /api/auth/session                                  │  │ │
│  │ │ - /api/auth/providers                                │  │ │
│  │ └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          │                                       │
│                          │ HTTP calls                            │
│                          ▼                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TIER 3: YOUR BACKEND (FastAPI/Django/Node.js)                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ POST /auth/oauth-callback                                  │ │
│  │ - Receives: {email, name, googleId, picture}               │ │
│  │ - Returns: {success, access_token, user_data}              │ │
│  │                                                            │ │
│  │ Database Operations:                                       │ │
│  │ 1. Query: SELECT * FROM users WHERE email = ?              │ │
│  │ 2. If exists: UPDATE user SET google_id = ?, ...           │ │
│  │ 3. If not: INSERT INTO users (email, name, ...) VALUES ... │ │
│  │ 4. Generate JWT: sign({sub, email, ...}, secret)           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          │                                       │
│                          │ Database access                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ DATABASE (PostgreSQL/MySQL/MongoDB)                        │ │
│  │                                                            │ │
│  │ users table:                                              │ │
│  │ ┌─────────────────────────────────────────────────────┐  │ │
│  │ │ id | email | name | google_id | picture_url | ...  │  │ │
│  │ └─────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │ oauth_tokens table (optional):                            │ │
│  │ ┌─────────────────────────────────────────────────────┐  │ │
│  │ │ user_id | token | expires_at | revoked | ...       │  │ │
│  │ └─────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EXTERNAL SERVICES                                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Google OAuth Server (accounts.google.com)                  │ │
│  │ - OAuth 2.0 authorization endpoint                         │ │
│  │ - User authentication & consent                            │ │
│  │ - Token generation                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow During Login

```
Timeline of events:

T=0ms   User clicks "Sign in with Google"
        └─> signIn('google') called
        └─> Redirect to: /api/auth/signin/google?callbackUrl=/

T=100ms Browser redirects to Google
        URL: https://accounts.google.com/o/oauth2/v2/auth?
             client_id=...&
             redirect_uri=http://localhost:3000/api/auth/callback/google&
             scope=openid profile email&
             state=...&
             response_type=code

T=1-5s  User logs in to Google account
        User sees consent screen
        User clicks "Allow"
        └─> Google generates authorization code

T=6s    Google redirects back to your app
        URL: http://localhost:3000/api/auth/callback/google?code=...&state=...
        └─> NextAuth.js intercepts this

T=7s    NextAuth backend exchanges code for token
        - Makes POST request to Google token endpoint
        - Receives: ID Token (JWT) + Access Token
        - Verifies ID Token signature
        - Extracts: {sub, email, name, picture}

T=8s    NextAuth calls your oauth-callback endpoint
        POST /auth/oauth-callback
        Payload: {
          email: "user@example.com",
          name: "User Name",
          googleId: "110123456789...",
          picture: "https://..."
        }

T=9s    Backend processes request:
        - Query database for user by email
        - If exists: Update google_id, picture, name
        - If not: Create new user record
        - Generate JWT token

T=10s   Backend returns response:
        {
          "success": true,
          "access_token": "eyJhbGc...",
          "user": {
            "id": "user_123",
            "email": "user@example.com",
            "name": "User Name"
          }
        }

T=11s   NextAuth.js receives response
        - Creates JWT token from token data
        - Stores in httpOnly cookie (secure!)
        - Calls redirect callback

T=12s   Browser redirects to app home page
        URL: http://localhost:3000/
        └─> App is now authenticated!
        └─> useSession() returns user data

T=13s   Dashboard page loads
        - Page middleware checks session
        - useSession() hook provides user data
        - Protected resources accessible
        - API calls include auth token
```

---

## 4. Session Management

```
Session Storage (Secure):

┌────────────────────────────────────┐
│  Browser httpOnly Secure Cookie    │
├────────────────────────────────────┤
│                                    │
│  next-auth.session-token=<jwt>     │
│                                    │
│  - httpOnly: Can't be accessed      │
│    by JavaScript                   │
│  - Secure: Only sent over HTTPS    │
│  - SameSite: CSRF protection        │
│                                    │
└────────────────────────────────────┘

Session Verification:

When user makes authenticated request:

1. Browser automatically sends cookie
2. Backend/NextAuth verifies JWT signature
3. JWT contains: {sub, email, oauth_provider, iat, exp}
4. Check if token expired (exp > current_time)
5. If valid: User is authenticated
6. If invalid: Redirect to login

Session Refresh:

If JWT expires:
1. NextAuth checks if there's a refresh_token
2. Exchanges refresh_token for new access_token
3. Updates cookie with new token
4. User stays logged in (seamless)

Session Logout:

1. User clicks logout
2. signOut() is called
3. Cookie is deleted
4. (Optional) Token added to revocation list
5. User redirected to login page
```

---

## 5. Error Handling Flow

```
├─ Google OAuth Errors
│  ├─ Invalid Client ID
│  │  └─> Check GOOGLE_CLIENT_ID in .env
│  │
│  ├─ Invalid Redirect URI
│  │  └─> Add URI to Google Cloud Console
│  │
│  ├─ User Cancels Auth
│  │  └─> Show friendly message
│  │
│  └─ Token Verification Failed
│     └─> Log error, retry later
│
├─ Backend Errors
│  ├─ Database Connection Failed
│  │  └─> Return 500, log error, retry
│  │
│  ├─ User Already Exists
│  │  └─> Return existing user, update OAuth fields
│  │
│  ├─ Invalid JWT Secret
│  │  └─> Check NEXTAUTH_SECRET
│  │
│  └─ OAuth Callback Validation Failed
│     └─> Return 400, show error message
│
└─ Client/Session Errors
   ├─ Session Expired
   │  └─> Redirect to login
   │
   ├─ Invalid Token
   │  └─> Clear session, show login page
   │
   └─ Network Error
      └─> Show retry button
```

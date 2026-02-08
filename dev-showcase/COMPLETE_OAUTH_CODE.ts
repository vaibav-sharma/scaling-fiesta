// ============================================
// COMPLETE OAUTH IMPLEMENTATION GUIDE
// TypeScript/Next.js/FastAPI
// ============================================

// ============================================
// 1. NEXTAUTH CONFIGURATION
// ============================================

// File: app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import { apiRequest } from "@/src/utils/apiClient"

// Types
interface GoogleProfile {
  id: string
  name: string
  email: string
  image: string
}

interface CustomToken extends JWT {
  accessToken?: string
  googleId?: string
  userId?: string
}

interface CustomSession extends Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    id?: string
  }
  accessToken?: string
}

export const authOptions = {
  providers: [
    // OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      async profile(profile: GoogleProfile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.image,
        }
      },
    }),

    // Fallback: Email/Password Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const result = await apiRequest({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/token`,
            operation: "LoginUser",
            payload: {
              username: credentials.username.trim(),
              password: credentials.password.trim(),
            },
            payloadType: "form",
          })

          if (result.success && result.data?.access_token) {
            return {
              id: result.data.user_id || credentials.username,
              name: result.data.user_name || credentials.username,
              email: credentials.username,
            }
          }
          return null
        } catch (error) {
          console.error("Credentials auth failed:", error)
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    // JWT Callback: Add custom data to token
    async jwt({ token, account, user, profile }: any) {
      // First login
      if (account && user) {
        token.accessToken = account.access_token
        token.googleId = account.providerAccountId
        token.userId = user.id || user.email
      }

      // Store user data
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      return token
    },

    // Session Callback: Add JWT data to session
    async session({
      session,
      token,
    }: {
      session: CustomSession
      token: CustomToken
    }) {
      if (session.user) {
        session.user.id = token.userId || token.sub
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture as string
      }
      session.accessToken = token.accessToken
      return session
    },

    // SignIn Callback: Validate user before creating session
    async signIn({ user, account, profile, email, credentials }: any) {
      try {
        // For OAuth (Google)
        if (account?.provider === "google") {
          // Call backend to verify/create user
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth-callback`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                googleId: account.providerAccountId,
                picture: user.image,
              }),
            }
          )

          if (!response.ok) {
            console.error("OAuth callback validation failed")
            return false
          }

          // Store backend response in user object for jwt callback
          user.backendToken = (await response.json()).access_token
          return true
        }

        // For Credentials (email/password)
        if (account?.provider === "credentials") {
          return true
        }

        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },

    // Redirect Callback: Handle post-signin redirects
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update every day
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// ============================================
// 2. COMPONENT: Google Sign-In Button
// ============================================

// File: src/components/GoogleSignInButton.tsx
"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/src/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface GoogleSignInButtonProps {
  isLoading?: boolean
  className?: string
}

export function GoogleSignInButton({
  isLoading = false,
  className = "",
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const result = await signIn("google", {
        redirect: true,
        callbackUrl: "/",
      })

      if (!result?.ok) {
        console.error("Google sign-in error:", result?.error)
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading || isLoading}
      variant="outline"
      className={`w-full h-10 flex items-center justify-center gap-2 ${className}`}
    >
      {loading || isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )}
      <span>{loading || isLoading ? "Signing in..." : "Sign in with Google"}</span>
    </Button>
  )
}

// ============================================
// 3. HOOKS: useAuthSession Hook
// ============================================

// File: src/hooks/useAuthSession.ts
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface UseAuthSessionOptions {
  required?: boolean
  onUnauthenticated?: () => void
}

export function useAuthSession(options: UseAuthSessionOptions = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { required = false, onUnauthenticated } = options

  useEffect(() => {
    if (required && status === "unauthenticated") {
      onUnauthenticated?.()
      router.push("/login")
    }
  }, [status, required, router, onUnauthenticated])

  return {
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    user: session?.user,
  }
}

// ============================================
// 4. BACKEND: FastAPI OAuth Handler
// ============================================

// File: backend/app/routers/auth.py (Python)
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
import jwt
from datetime import datetime, timedelta
import os
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.database import async_session

router = APIRouter(prefix="/api/auth", tags=["auth"])

class OAuthCallbackRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    googleId: str
    picture: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str]
    picture_url: Optional[str]
    oauth_provider: str
    created_at: datetime

@router.post("/oauth-callback", response_model=dict)
async def oauth_callback(request: OAuthCallbackRequest):
    """
    Handle OAuth callback from NextAuth.js
    Create or update user in database
    Return JWT token
    """
    try:
        async with async_session() as session:
            # Try to find existing user by email
            stmt = select(User).where(User.email == request.email)
            result = await session.execute(stmt)
            user = result.scalars().first()

            if user:
                # Update existing user
                user.google_id = request.googleId
                if request.name:
                    user.name = request.name
                if request.picture:
                    user.picture_url = request.picture
                user.oauth_provider = "google"
                user.updated_at = datetime.utcnow()
            else:
                # Create new user
                user = User(
                    email=request.email,
                    name=request.name or request.email.split("@")[0],
                    google_id=request.googleId,
                    picture_url=request.picture,
                    oauth_provider="google",
                    is_oauth_user=True,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                session.add(user)

            await session.commit()
            await session.refresh(user)

            # Generate JWT token
            token_data = {
                "sub": str(user.id),
                "email": user.email,
                "name": user.name,
                "oauth_provider": "google",
                "iat": datetime.utcnow(),
                "exp": datetime.utcnow() + timedelta(days=30),
            }

            access_token = jwt.encode(
                token_data,
                os.getenv("JWT_SECRET", "your-secret-key"),
                algorithm="HS256",
            )

            return {
                "success": True,
                "access_token": access_token,
                "token_type": "bearer",
                "expires_in": 30 * 24 * 60 * 60,
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.name,
                    "picture": user.picture_url,
                    "oauth_provider": user.oauth_provider,
                },
            }

    except Exception as e:
        print(f"OAuth callback error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth callback failed: {str(e)}",
        )

@router.post("/verify-token")
async def verify_token(token: str):
    """
    Verify and decode JWT token
    """
    try:
        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET", "your-secret-key"),
            algorithms=["HS256"],
        )

        # Check expiration
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
            )

        return {
            "success": True,
            "user": {
                "id": payload.get("sub"),
                "email": payload.get("email"),
                "name": payload.get("name"),
                "oauth_provider": payload.get("oauth_provider"),
            },
        }

    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )

@router.post("/logout")
async def logout(user_id: str):
    """
    Logout user (optional - for token revocation)
    """
    # Optional: Add token to revocation list
    # or clear session from database
    return {"success": True, "message": "Logged out successfully"}

# ============================================
// 5. MIDDLEWARE: Protect Routes
// ============================================

// File: middleware.ts
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ["/dashboard", "/settings", "/profile"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Redirect to login if no token and accessing protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to home if authenticated and accessing login
  if (pathname === "/login" && token) {
    const homeUrl = new URL("/", request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/login",
  ],
}

// ============================================
// 6. ENVIRONMENT VARIABLES
// ============================================

// File: .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_-base64_32
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
JWT_SECRET=your_backend_jwt_secret

// ============================================
// 7. DATABASE SCHEMA
// ============================================

// File: migrations/create_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    oauth_provider VARCHAR(50),
    picture_url TEXT,
    is_oauth_user BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

// ============================================
// 8. USAGE EXAMPLES
// ============================================

// Use in Component
import { useAuthSession } from "@/src/hooks/useAuthSession"

export default function Dashboard() {
  const { session, isAuthenticated, user } = useAuthSession({ required: true })

  if (!isAuthenticated) return <Loading />

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
  )
}

// Sign Out
import { signOut } from "next-auth/react"

<button onClick={() => signOut({ callbackUrl: "/login" })}>
  Sign Out
</button>

// Get Session
import { getServerSession } from "next-auth/next"

export async function getServerSideProps() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return { redirect: { destination: "/login" } }
  }
  return { props: { session } }
}

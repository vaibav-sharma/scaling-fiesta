"""
Backend OAuth Proxy Implementation Guide
=========================================

For your FastAPI/Python backend to handle OAuth tokens
"""

# requirements.txt
# Add these to your backend requirements:
# PyJWT==2.8.1
# google-auth==2.28.0
# google-auth-httplib2==0.2.0
# google-auth-oauthlib==1.2.0
# python-jose==3.3.0
# pydantic==2.5.0


# ==================== FASTAPI EXAMPLE ====================

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional
import jwt
from google.auth.transport import requests
from google.oauth2 import id_token
import os

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"


class OAuthCallbackPayload(BaseModel):
    """OAuth callback payload from frontend"""
    email: str
    name: Optional[str] = None
    googleId: str
    picture: Optional[str] = None


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str
    expires_in: int


class UserProfile(BaseModel):
    """User profile from OAuth"""
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    oauth_provider: str = "google"


@router.post("/oauth-callback")
async def oauth_callback(payload: OAuthCallbackPayload):
    """
    Receive OAuth callback from NextAuth.js
    
    1. Verify the OAuth credentials (optional - NextAuth already verified)
    2. Create or update user in database
    3. Generate JWT token
    4. Return session data
    """
    try:
        # Verify user exists or create new user
        user = await get_or_create_user(
            email=payload.email,
            name=payload.name,
            google_id=payload.googleId,
            picture=payload.picture
        )
        
        # Create JWT token
        token_data = {
            "sub": user.id,
            "email": user.email,
            "name": user.name,
            "oauth_provider": "google",
            "iat": int(datetime.now().timestamp()),
            "exp": int((datetime.now() + timedelta(days=30)).timestamp())
        }
        
        access_token = jwt.encode(
            token_data,
            JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )
        
        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": user.dict(),
            "expires_in": 30 * 24 * 60 * 60  # 30 days in seconds
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth callback failed: {str(e)}"
        )


@router.post("/verify-token")
async def verify_token(token: str):
    """
    Verify Google ID token from client
    
    Called by frontend to validate token before sending to backend
    """
    try:
        # Verify with Google
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )
        
        # Token is valid, return user info
        return {
            "success": True,
            "user": {
                "email": idinfo.get("email"),
                "name": idinfo.get("name"),
                "picture": idinfo.get("picture"),
                "google_id": idinfo.get("sub")
            }
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )


@router.post("/logout")
async def logout(user_id: str):
    """
    Optional: Invalidate user session
    Store revoked tokens in Redis or database
    """
    # Store in revocation list
    # await revoke_token(user_id)
    return {"success": True, "message": "Logged out successfully"}


# ==================== DATABASE HELPERS ====================

async def get_or_create_user(email: str, name: str, google_id: str, picture: str = None):
    """
    Find user by email or create new user with OAuth data
    
    Example with your existing database:
    """
    from sqlalchemy import select
    from sqlalchemy.ext.asyncio import AsyncSession
    
    # Pseudo-code - adapt to your actual database
    """
    async with async_session() as session:
        # Try to find existing user
        stmt = select(User).where(User.email == email)
        result = await session.execute(stmt)
        user = result.scalars().first()
        
        if user:
            # Update OAuth data
            user.google_id = google_id
            user.name = name
            user.picture = picture
        else:
            # Create new user
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                picture=picture,
                oauth_provider="google",
                is_oauth_user=True
            )
            session.add(user)
        
        await session.commit()
        return user
    """
    pass


# ==================== ENVIRONMENT VARIABLES ====================
"""
# .env (Backend)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
JWT_SECRET=your_long_random_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=720
DATABASE_URL=your_database_url
"""


from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
import hashlib
from app.core.config import settings

class AuthService:
    def __init__(self):
        pass

    def hash_password(self, password: str) -> str:
        """Hash a password using SHA256 (simplified for testing)"""
        # In production, use bcrypt. For testing, using SHA256 with salt
        salt = "sweet_shop_salt"
        return hashlib.sha256((password + salt).encode()).hexdigest()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return self.hash_password(plain_password) == hashed_password

    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError as e:
            raise JWTError(f"Token verification failed: {str(e)}")

# Create a global instance
auth_service = AuthService()
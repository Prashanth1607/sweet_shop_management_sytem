import pytest
from datetime import datetime, timedelta
from jose import jwt, JWTError

from app.core.auth import AuthService
from app.core.config import settings

class TestAuthService:
    def setup_method(self):
        self.auth_service = AuthService()

    def test_hash_password(self):
        """Test password hashing"""
        password = "testpassword123"
        hashed = self.auth_service.hash_password(password)
        
        assert hashed != password
        assert len(hashed) > 0
        assert len(hashed) == 64  # SHA256 hex length

    def test_verify_password_correct(self):
        """Test password verification with correct password"""
        password = "testpassword123"
        hashed = self.auth_service.hash_password(password)
        
        assert self.auth_service.verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password"""
        password = "testpassword123"
        wrong_password = "wrongpassword"
        hashed = self.auth_service.hash_password(password)
        
        assert self.auth_service.verify_password(wrong_password, hashed) is False

    def test_create_access_token(self):
        """Test JWT token creation"""
        data = {"sub": "test@example.com", "user_id": "123"}
        token = self.auth_service.create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Decode token to verify contents
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert decoded["sub"] == "test@example.com"
        assert decoded["user_id"] == "123"
        assert "exp" in decoded

    def test_create_access_token_with_expiry(self):
        """Test JWT token creation with custom expiry"""
        data = {"sub": "test@example.com"}
        expires_delta = timedelta(minutes=15)
        token = self.auth_service.create_access_token(data, expires_delta)
        
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        exp_timestamp = decoded["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=datetime.now().astimezone().tzinfo)
        
        # Check that expiry is approximately 15 minutes from now
        expected_exp = datetime.now(datetime.now().astimezone().tzinfo) + expires_delta
        assert abs((exp_datetime - expected_exp).total_seconds()) < 60  # Within 1 minute

    def test_verify_token_valid(self):
        """Test token verification with valid token"""
        data = {"sub": "test@example.com", "user_id": "123"}
        token = self.auth_service.create_access_token(data)
        
        decoded_data = self.auth_service.verify_token(token)
        
        assert decoded_data["sub"] == "test@example.com"
        assert decoded_data["user_id"] == "123"

    def test_verify_token_invalid(self):
        """Test token verification with invalid token"""
        invalid_token = "invalid.token.here"
        
        with pytest.raises(JWTError):
            self.auth_service.verify_token(invalid_token)

    def test_verify_token_expired(self):
        """Test token verification with expired token"""
        data = {"sub": "test@example.com"}
        # Create token that expires immediately
        expires_delta = timedelta(seconds=-1)
        token = self.auth_service.create_access_token(data, expires_delta)
        
        with pytest.raises(JWTError):
            self.auth_service.verify_token(token)

    def test_verify_token_wrong_secret(self):
        """Test token verification with wrong secret key"""
        data = {"sub": "test@example.com"}
        # Create token with different secret
        wrong_token = jwt.encode(data, "wrong-secret", algorithm=settings.ALGORITHM)
        
        with pytest.raises(JWTError):
            self.auth_service.verify_token(wrong_token)
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import Base, get_db
from app.models.user import User

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

class TestUserRegistration:
    def test_register_user_success(self, client):
        """Test successful user registration"""
        user_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["is_admin"] is False
        assert "id" in data
        assert "created_at" in data
        assert "password" not in data  # Password should not be returned

    def test_register_user_duplicate_email(self, client):
        """Test registration with duplicate email"""
        user_data = {
            "email": "duplicate@example.com",
            "password": "password123"
        }
        
        # First registration should succeed
        response1 = client.post("/api/v1/auth/register", json=user_data)
        assert response1.status_code == 201
        
        # Second registration with same email should fail
        response2 = client.post("/api/v1/auth/register", json=user_data)
        assert response2.status_code == 400
        assert "already registered" in response2.json()["detail"].lower()

    def test_register_user_invalid_email(self, client):
        """Test registration with invalid email"""
        user_data = {
            "email": "invalid-email",
            "password": "password123"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 422  # Validation error

    def test_register_user_missing_password(self, client):
        """Test registration without password"""
        user_data = {
            "email": "test@example.com"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 422  # Validation error

    def test_register_user_empty_password(self, client):
        """Test registration with empty password"""
        user_data = {
            "email": "test@example.com",
            "password": ""
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 422  # Validation error

    def test_register_user_password_hashed(self, client):
        """Test that password is properly hashed in database"""
        user_data = {
            "email": "hash@example.com",
            "password": "password123"
        }
        
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 201
        
        # Check that password is hashed in database
        db = TestingSessionLocal()
        user = db.query(User).filter(User.email == "hash@example.com").first()
        assert user is not None
        assert user.hashed_password != "password123"
        assert len(user.hashed_password) > 0
        db.close()

class TestUserLogin:
    def test_login_user_success(self, client):
        """Test successful user login"""
        # First register a user
        user_data = {
            "email": "login@example.com",
            "password": "password123"
        }
        client.post("/api/v1/auth/register", json=user_data)
        
        # Now login
        login_data = {
            "email": "login@example.com",
            "password": "password123"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == "login@example.com"

    def test_login_user_invalid_email(self, client):
        """Test login with non-existent email"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "password123"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]

    def test_login_user_invalid_password(self, client):
        """Test login with wrong password"""
        # First register a user
        user_data = {
            "email": "wrongpass@example.com",
            "password": "correctpassword"
        }
        client.post("/api/v1/auth/register", json=user_data)
        
        # Try login with wrong password
        login_data = {
            "email": "wrongpass@example.com",
            "password": "wrongpassword"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]

    def test_login_user_invalid_email_format(self, client):
        """Test login with invalid email format"""
        login_data = {
            "email": "invalid-email",
            "password": "password123"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 422  # Validation error

    def test_login_user_missing_password(self, client):
        """Test login without password"""
        login_data = {
            "email": "test@example.com"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 422  # Validation error

    def test_login_token_contains_user_info(self, client):
        """Test that JWT token contains user information"""
        # Register and login user
        user_data = {
            "email": "tokentest@example.com",
            "password": "password123"
        }
        register_response = client.post("/api/v1/auth/register", json=user_data)
        user_id = register_response.json()["id"]
        
        login_data = {
            "email": "tokentest@example.com",
            "password": "password123"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # Decode token to verify contents (using auth service)
        from app.core.auth import auth_service
        decoded = auth_service.verify_token(token)
        assert decoded["sub"] == "tokentest@example.com"
        assert decoded["user_id"] == user_id

class TestProtectedRoutes:
    def test_get_current_user_success(self, client):
        """Test accessing protected route with valid token"""
        # Register and login user
        user_data = {
            "email": "protected@example.com",
            "password": "password123"
        }
        client.post("/api/v1/auth/register", json=user_data)
        
        login_response = client.post("/api/v1/auth/login", json=user_data)
        token = login_response.json()["access_token"]
        
        # Access protected route
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/v1/users/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "protected@example.com"

    def test_get_current_user_no_token(self, client):
        """Test accessing protected route without token"""
        response = client.get("/api/v1/users/me")
        
        assert response.status_code == 403  # Forbidden

    def test_get_current_user_invalid_token(self, client):
        """Test accessing protected route with invalid token"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/v1/users/me", headers=headers)
        
        assert response.status_code == 401
        assert "Could not validate credentials" in response.json()["detail"]

    def test_get_current_user_expired_token(self, client):
        """Test accessing protected route with expired token"""
        from datetime import timedelta
        from app.core.auth import auth_service
        
        # Create expired token
        token_data = {"sub": "test@example.com", "user_id": "123"}
        expired_token = auth_service.create_access_token(
            token_data, 
            expires_delta=timedelta(seconds=-1)
        )
        
        headers = {"Authorization": f"Bearer {expired_token}"}
        response = client.get("/api/v1/users/me", headers=headers)
        
        assert response.status_code == 401
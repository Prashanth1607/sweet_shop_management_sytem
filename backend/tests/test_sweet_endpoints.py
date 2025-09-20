import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import Base, get_db
from app.models.user import User
from app.models.sweet import Sweet

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_sweets.db"
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

@pytest.fixture
def admin_token(client):
    """Create admin user and return token"""
    # Create admin user directly in database
    db = TestingSessionLocal()
    from app.core.auth import auth_service
    admin_user = User(
        email="admin@example.com",
        hashed_password=auth_service.hash_password("admin123"),
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
    db.close()
    
    # Login to get token
    login_data = {"email": "admin@example.com", "password": "admin123"}
    response = client.post("/api/v1/auth/login", json=login_data)
    return response.json()["access_token"]

@pytest.fixture
def user_token(client):
    """Create regular user and return token"""
    user_data = {"email": "user@example.com", "password": "user123"}
    client.post("/api/v1/auth/register", json=user_data)
    
    response = client.post("/api/v1/auth/login", json=user_data)
    return response.json()["access_token"]

class TestSweetCRUD:
    def test_create_sweet_success(self, client, admin_token):
        """Test successful sweet creation by admin"""
        sweet_data = {
            "name": "Chocolate Bar",
            "category": "Chocolate",
            "price": 2.50,
            "quantity": 100
        }
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = client.post("/api/v1/sweets/", json=sweet_data, headers=headers)
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Chocolate Bar"
        assert data["category"] == "Chocolate"
        assert float(data["price"]) == 2.50
        assert data["quantity"] == 100
        assert "id" in data

    def test_create_sweet_non_admin(self, client, user_token):
        """Test sweet creation by non-admin user fails"""
        sweet_data = {
            "name": "Gummy Bears",
            "category": "Gummy",
            "price": 1.99,
            "quantity": 50
        }
        
        headers = {"Authorization": f"Bearer {user_token}"}
        response = client.post("/api/v1/sweets/", json=sweet_data, headers=headers)
        
        assert response.status_code == 403
        assert "Not enough permissions" in response.json()["detail"]

    def test_get_sweets_success(self, client, admin_token):
        """Test getting all sweets"""
        # Create a sweet first
        sweet_data = {
            "name": "Lollipop",
            "category": "Hard Candy",
            "price": 0.50,
            "quantity": 200
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        client.post("/api/v1/sweets/", json=sweet_data, headers=headers)
        
        # Get all sweets
        response = client.get("/api/v1/sweets/")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["name"] == "Lollipop"

    def test_get_sweets_pagination(self, client, admin_token):
        """Test sweet pagination"""
        # Create multiple sweets
        headers = {"Authorization": f"Bearer {admin_token}"}
        for i in range(5):
            sweet_data = {
                "name": f"Sweet {i}",
                "category": "Test",
                "price": 1.00,
                "quantity": 10
            }
            client.post("/api/v1/sweets/", json=sweet_data, headers=headers)
        
        # Test pagination
        response = client.get("/api/v1/sweets/?skip=2&limit=2")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_update_sweet_success(self, client, admin_token):
        """Test successful sweet update by admin"""
        # Create sweet first
        sweet_data = {
            "name": "Original Name",
            "category": "Original Category",
            "price": 1.00,
            "quantity": 10
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        create_response = client.post("/api/v1/sweets/", json=sweet_data, headers=headers)
        sweet_id = create_response.json()["id"]
        
        # Update sweet
        update_data = {
            "name": "Updated Name",
            "price": 2.00
        }
        response = client.put(f"/api/v1/sweets/{sweet_id}", json=update_data, headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert float(data["price"]) == 2.00
        assert data["category"] == "Original Category"  # Unchanged

    def test_delete_sweet_success(self, client, admin_token):
        """Test successful sweet deletion by admin"""
        # Create sweet first
        sweet_data = {
            "name": "To Delete",
            "category": "Test",
            "price": 1.00,
            "quantity": 10
        }
        headers = {"Authorization": f"Bearer {admin_token}"}
        create_response = client.post("/api/v1/sweets/", json=sweet_data, headers=headers)
        sweet_id = create_response.json()["id"]
        
        # Delete sweet
        response = client.delete(f"/api/v1/sweets/{sweet_id}", headers=headers)
        
        assert response.status_code == 200
        assert "deleted successfully" in response.json()["message"]
        
        # Verify sweet is deleted
        get_response = client.get(f"/api/v1/sweets/{sweet_id}")
        assert get_response.status_code == 404

class TestSweetSearch:
    def test_search_by_name(self, client, admin_token):
        """Test searching sweets by name"""
        # Create test sweets
        headers = {"Authorization": f"Bearer {admin_token}"}
        sweets = [
            {"name": "Chocolate Bar", "category": "Chocolate", "price": 2.50, "quantity": 10},
            {"name": "Chocolate Chip Cookie", "category": "Cookie", "price": 1.50, "quantity": 20},
            {"name": "Vanilla Wafer", "category": "Cookie", "price": 1.00, "quantity": 15}
        ]
        
        for sweet in sweets:
            client.post("/api/v1/sweets/", json=sweet, headers=headers)
        
        # Search for chocolate
        response = client.get("/api/v1/sweets/search?query=chocolate")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all("chocolate" in sweet["name"].lower() for sweet in data)

    def test_search_by_category(self, client, admin_token):
        """Test searching sweets by category"""
        # Create test sweets (using same data as above)
        headers = {"Authorization": f"Bearer {admin_token}"}
        sweets = [
            {"name": "Chocolate Bar", "category": "Chocolate", "price": 2.50, "quantity": 10},
            {"name": "Chocolate Chip Cookie", "category": "Cookie", "price": 1.50, "quantity": 20},
            {"name": "Vanilla Wafer", "category": "Cookie", "price": 1.00, "quantity": 15}
        ]
        
        for sweet in sweets:
            client.post("/api/v1/sweets/", json=sweet, headers=headers)
        
        # Search by category
        response = client.get("/api/v1/sweets/search?category=cookie")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert all("cookie" in sweet["category"].lower() for sweet in data)

    def test_search_by_price_range(self, client, admin_token):
        """Test searching sweets by price range"""
        # Create test sweets
        headers = {"Authorization": f"Bearer {admin_token}"}
        sweets = [
            {"name": "Cheap Candy", "category": "Candy", "price": 0.50, "quantity": 10},
            {"name": "Medium Candy", "category": "Candy", "price": 1.50, "quantity": 10},
            {"name": "Expensive Candy", "category": "Candy", "price": 3.00, "quantity": 10}
        ]
        
        for sweet in sweets:
            client.post("/api/v1/sweets/", json=sweet, headers=headers)
        
        # Search by price range
        response = client.get("/api/v1/sweets/search?min_price=1.0&max_price=2.0")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Medium Candy"
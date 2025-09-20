import pytest
import uuid
from decimal import Decimal
from datetime import datetime
from pydantic import ValidationError

from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.schemas.sweet import SweetCreate, SweetUpdate, SweetResponse
from app.schemas.purchase import PurchaseCreate, PurchaseResponse

class TestUserSchemas:
    def test_user_create_valid(self):
        """Test valid user creation schema"""
        user_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        user = UserCreate(**user_data)
        
        assert user.email == "test@example.com"
        assert user.password == "password123"

    def test_user_create_invalid_email(self):
        """Test user creation with invalid email"""
        user_data = {
            "email": "invalid-email",
            "password": "password123"
        }
        
        with pytest.raises(ValidationError):
            UserCreate(**user_data)

    def test_user_create_missing_password(self):
        """Test user creation without password"""
        user_data = {
            "email": "test@example.com"
        }
        
        with pytest.raises(ValidationError):
            UserCreate(**user_data)

    def test_user_login_valid(self):
        """Test valid user login schema"""
        login_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        login = UserLogin(**login_data)
        
        assert login.email == "test@example.com"
        assert login.password == "password123"

    def test_user_response_valid(self):
        """Test user response schema"""
        user_id = uuid.uuid4()
        user_data = {
            "id": user_id,
            "email": "test@example.com",
            "is_admin": False,
            "created_at": datetime.now()
        }
        user = UserResponse(**user_data)
        
        assert user.id == user_id
        assert user.email == "test@example.com"
        assert user.is_admin is False
        assert isinstance(user.created_at, datetime)

class TestSweetSchemas:
    def test_sweet_create_valid(self):
        """Test valid sweet creation schema"""
        sweet_data = {
            "name": "Chocolate Bar",
            "category": "Chocolate",
            "price": Decimal("2.50"),
            "quantity": 100
        }
        sweet = SweetCreate(**sweet_data)
        
        assert sweet.name == "Chocolate Bar"
        assert sweet.category == "Chocolate"
        assert sweet.price == Decimal("2.50")
        assert sweet.quantity == 100

    def test_sweet_create_negative_price(self):
        """Test sweet creation with negative price"""
        sweet_data = {
            "name": "Chocolate Bar",
            "category": "Chocolate",
            "price": Decimal("-1.00"),
            "quantity": 100
        }
        
        with pytest.raises(ValidationError):
            SweetCreate(**sweet_data)

    def test_sweet_create_negative_quantity(self):
        """Test sweet creation with negative quantity"""
        sweet_data = {
            "name": "Chocolate Bar",
            "category": "Chocolate",
            "price": Decimal("2.50"),
            "quantity": -5
        }
        
        with pytest.raises(ValidationError):
            SweetCreate(**sweet_data)

    def test_sweet_update_partial(self):
        """Test sweet update with partial data"""
        update_data = {
            "name": "Updated Chocolate Bar",
            "price": Decimal("3.00")
        }
        sweet_update = SweetUpdate(**update_data)
        
        assert sweet_update.name == "Updated Chocolate Bar"
        assert sweet_update.price == Decimal("3.00")
        assert sweet_update.category is None
        assert sweet_update.quantity is None

    def test_sweet_response_valid(self):
        """Test sweet response schema"""
        sweet_id = uuid.uuid4()
        sweet_data = {
            "id": sweet_id,
            "name": "Gummy Bears",
            "category": "Gummy",
            "price": Decimal("1.99"),
            "quantity": 50,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        sweet = SweetResponse(**sweet_data)
        
        assert sweet.id == sweet_id
        assert sweet.name == "Gummy Bears"
        assert sweet.category == "Gummy"
        assert sweet.price == Decimal("1.99")
        assert sweet.quantity == 50

class TestPurchaseSchemas:
    def test_purchase_create_valid(self):
        """Test valid purchase creation schema"""
        sweet_id = uuid.uuid4()
        purchase_data = {
            "sweet_id": sweet_id,
            "quantity": 2
        }
        purchase = PurchaseCreate(**purchase_data)
        
        assert purchase.sweet_id == sweet_id
        assert purchase.quantity == 2

    def test_purchase_create_zero_quantity(self):
        """Test purchase creation with zero quantity"""
        sweet_id = uuid.uuid4()
        purchase_data = {
            "sweet_id": sweet_id,
            "quantity": 0
        }
        
        with pytest.raises(ValidationError):
            PurchaseCreate(**purchase_data)

    def test_purchase_create_negative_quantity(self):
        """Test purchase creation with negative quantity"""
        sweet_id = uuid.uuid4()
        purchase_data = {
            "sweet_id": sweet_id,
            "quantity": -1
        }
        
        with pytest.raises(ValidationError):
            PurchaseCreate(**purchase_data)

    def test_purchase_response_valid(self):
        """Test purchase response schema"""
        purchase_id = uuid.uuid4()
        user_id = uuid.uuid4()
        sweet_id = uuid.uuid4()
        purchase_data = {
            "id": purchase_id,
            "user_id": user_id,
            "sweet_id": sweet_id,
            "quantity": 3,
            "total_price": Decimal("7.50"),
            "created_at": datetime.now()
        }
        purchase = PurchaseResponse(**purchase_data)
        
        assert purchase.id == purchase_id
        assert purchase.user_id == user_id
        assert purchase.sweet_id == sweet_id
        assert purchase.quantity == 3
        assert purchase.total_price == Decimal("7.50")
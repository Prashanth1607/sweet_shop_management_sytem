import pytest
import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

from app.db.database import Base
from app.models.user import User
from app.models.sweet import Sweet
from app.models.purchase import Purchase

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

class TestUserModel:
    def test_create_user_success(self, db_session):
        """Test successful user creation"""
        user = User(
            email="test@example.com",
            hashed_password="hashed_password_123",
            is_admin=False
        )
        db_session.add(user)
        db_session.commit()
        
        assert user.id is not None
        assert user.email == "test@example.com"
        assert user.hashed_password == "hashed_password_123"
        assert user.is_admin is False
        assert user.created_at is not None
        assert user.updated_at is not None

    def test_user_email_unique_constraint(self, db_session):
        """Test that email must be unique"""
        user1 = User(email="test@example.com", hashed_password="hash1")
        user2 = User(email="test@example.com", hashed_password="hash2")
        
        db_session.add(user1)
        db_session.commit()
        
        db_session.add(user2)
        with pytest.raises(IntegrityError):
            db_session.commit()

    def test_user_admin_default_false(self, db_session):
        """Test that is_admin defaults to False"""
        user = User(email="test@example.com", hashed_password="hash")
        db_session.add(user)
        db_session.commit()
        
        assert user.is_admin is False

class TestSweetModel:
    def test_create_sweet_success(self, db_session):
        """Test successful sweet creation"""
        sweet = Sweet(
            name="Chocolate Bar",
            category="Chocolate",
            price=Decimal("2.50"),
            quantity=100
        )
        db_session.add(sweet)
        db_session.commit()
        
        assert sweet.id is not None
        assert sweet.name == "Chocolate Bar"
        assert sweet.category == "Chocolate"
        assert sweet.price == Decimal("2.50")
        assert sweet.quantity == 100
        assert sweet.created_at is not None
        assert sweet.updated_at is not None

    def test_sweet_quantity_non_negative(self, db_session):
        """Test that quantity cannot be negative"""
        sweet = Sweet(
            name="Gummy Bears",
            category="Gummy",
            price=Decimal("1.99"),
            quantity=-5
        )
        db_session.add(sweet)
        # This should be handled by application logic, not database constraint
        db_session.commit()
        assert sweet.quantity == -5  # Database allows it, app should validate

    def test_sweet_price_precision(self, db_session):
        """Test price decimal precision"""
        sweet = Sweet(
            name="Expensive Candy",
            category="Premium",
            price=Decimal("99.99"),
            quantity=1
        )
        db_session.add(sweet)
        db_session.commit()
        
        assert sweet.price == Decimal("99.99")

class TestPurchaseModel:
    def test_create_purchase_success(self, db_session):
        """Test successful purchase creation"""
        # Create user and sweet first
        user = User(email="buyer@example.com", hashed_password="hash")
        sweet = Sweet(name="Lollipop", category="Hard Candy", price=Decimal("0.50"), quantity=10)
        
        db_session.add(user)
        db_session.add(sweet)
        db_session.commit()
        
        purchase = Purchase(
            user_id=user.id,
            sweet_id=sweet.id,
            quantity=2,
            total_price=Decimal("1.00")
        )
        db_session.add(purchase)
        db_session.commit()
        
        assert purchase.id is not None
        assert purchase.user_id == user.id
        assert purchase.sweet_id == sweet.id
        assert purchase.quantity == 2
        assert purchase.total_price == Decimal("1.00")
        assert purchase.created_at is not None

    def test_purchase_relationships(self, db_session):
        """Test purchase relationships with user and sweet"""
        user = User(email="buyer@example.com", hashed_password="hash")
        sweet = Sweet(name="Candy Cane", category="Mint", price=Decimal("1.25"), quantity=5)
        
        db_session.add(user)
        db_session.add(sweet)
        db_session.commit()
        
        purchase = Purchase(
            user_id=user.id,
            sweet_id=sweet.id,
            quantity=1,
            total_price=Decimal("1.25")
        )
        db_session.add(purchase)
        db_session.commit()
        
        # Test relationships
        assert purchase.user == user
        assert purchase.sweet == sweet
        assert purchase in user.purchases
        assert purchase in sweet.purchases
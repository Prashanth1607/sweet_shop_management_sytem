from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.auth import auth_service

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash the password
        hashed_password = auth_service.hash_password(user_data.password)
        
        # Create new user
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            is_admin=False
        )
        
        try:
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Email already registered")

    def get_user_by_email(self, email: str) -> User:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def authenticate_user(self, email: str, password: str) -> User:
        """Authenticate user with email and password"""
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        if not auth_service.verify_password(password, user.hashed_password):
            return None
        
        return user
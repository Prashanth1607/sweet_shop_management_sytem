from fastapi import APIRouter, Depends
from app.schemas.user import UserResponse
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user
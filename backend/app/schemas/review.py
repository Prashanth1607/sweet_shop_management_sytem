from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class ReviewBase(BaseModel):
    sweet_id: str
    rating: int = Field(..., ge=1, le=5, description="Rating must be between 1 and 5")
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating must be between 1 and 5")
    comment: Optional[str] = None

class ReviewResponse(ReviewBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    # Include user email for display
    user_email: Optional[str] = None
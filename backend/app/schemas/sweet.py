from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class SweetBase(BaseModel):
    name: str
    category: str
    price: Decimal = Field(..., gt=0, description="Price must be greater than 0")
    quantity: int = Field(..., ge=0, description="Quantity must be non-negative")
    image_url: Optional[str] = None
    description: Optional[str] = None

class SweetCreate(SweetBase):
    pass

class SweetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0, description="Price must be greater than 0")
    quantity: Optional[int] = Field(None, ge=0, description="Quantity must be non-negative")
    image_url: Optional[str] = None
    description: Optional[str] = None

class SweetResponse(SweetBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    created_at: datetime
    updated_at: datetime
    avg_rating: Optional[float] = 0.0
    review_count: Optional[int] = 0
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class PurchaseBase(BaseModel):
    sweet_id: str
    quantity: int = Field(..., gt=0, description="Quantity must be greater than 0")

class PurchaseCreate(PurchaseBase):
    pass

class PurchaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    user_id: str
    sweet_id: str
    quantity: int
    total_price: Decimal
    created_at: datetime
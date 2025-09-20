from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.order import OrderStatus

class OrderItemBase(BaseModel):
    sweet_id: str
    quantity: int = Field(..., gt=0, description="Quantity must be greater than 0")
    unit_price: Decimal = Field(..., gt=0, description="Unit price must be greater than 0")

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    order_id: str
    total_price: Decimal
    created_at: datetime
    
    # Include sweet details
    sweet_name: Optional[str] = None
    sweet_image_url: Optional[str] = None

class OrderBase(BaseModel):
    shipping_address: Optional[str] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    shipping_address: Optional[str] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    user_id: str
    total_amount: Decimal
    status: OrderStatus
    created_at: datetime
    updated_at: datetime
    
    # Include order items
    order_items: List[OrderItemResponse] = []
    
    # Include user email for admin view
    user_email: Optional[str] = None
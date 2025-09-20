from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class ContactFormBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    is_bulk_order: bool = False

class ContactFormCreate(ContactFormBase):
    pass

class ContactFormUpdate(BaseModel):
    is_processed: Optional[bool] = None

class ContactFormResponse(ContactFormBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    is_processed: bool
    created_at: datetime
    updated_at: datetime
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict
import re

class UserBase(BaseModel):
    email: str = Field(..., description="User email address")

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid email format')
        return v

class UserCreate(UserBase):
    password: str = Field(..., min_length=1, description="Password must not be empty")

class UserLogin(BaseModel):
    email: str = Field(..., description="User email address")
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid email format')
        return v

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    is_admin: bool
    created_at: datetime
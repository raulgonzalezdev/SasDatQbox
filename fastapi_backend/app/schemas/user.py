from typing import Optional
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    billing_address: Optional[dict] = None  # Assuming JSON field maps to dict
    payment_method: Optional[dict] = None  # Assuming JSON field maps to dict

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr = Field(..., description="Email of the user")
    password: str = Field(..., min_length=8, description="Password of the user")

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = Field(None, min_length=8, description="New password for the user")

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    hashed_password: str

    class Config:
        from_attributes = True # Use from_attributes instead of orm_mode for Pydantic v2

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    pass

# Token schema for authentication
class Token(BaseModel):
    access_token: str
    token_type: str

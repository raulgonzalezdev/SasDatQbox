from typing import Optional
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field
import enum

class UserRole(str, enum.Enum):
    DOCTOR = "doctor"
    PATIENT = "patient"
    ADMIN = "admin"

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    is_active: Optional[bool] = True
    is_superuser: bool = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    businessName: Optional[str] = None  # Campo para el nombre del negocio
    isPremium: Optional[bool] = False  # Campo para indicar si es premium
    billing_address: Optional[dict] = None  # Assuming JSON field maps to dict
    payment_method: Optional[dict] = None  # Assuming JSON field maps to dict
    role: Optional[UserRole] = None # Added role

    class Config:
        from_attributes = True

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr = Field(..., description="Email of the user")
    password: str = Field(..., min_length=8, description="Password of the user")
    role: Optional[UserRole] = UserRole.PATIENT # Allow setting role on creation, default to PATIENT

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = Field(None, min_length=8, description="New password for the user")
    role: Optional[UserRole] = None # Allow updating role

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    hashed_password: str

    class Config:
        from_attributes = True

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str

# Token schema for authentication
class Token(BaseModel):
    access_token: str
    token_type: str

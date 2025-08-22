from typing import Optional, List
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

# --- BusinessLocation Schemas ---
class BusinessLocationBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None

class BusinessLocationCreate(BusinessLocationBase):
    business_id: UUID # Required on creation

class BusinessLocationUpdate(BusinessLocationBase):
    name: Optional[str] = None # Make name optional for update

class BusinessLocationInDBBase(BusinessLocationBase):
    id: UUID
    business_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BusinessLocation(BusinessLocationInDBBase):
    pass

class BusinessLocationInDB(BusinessLocationInDBBase):
    pass

# --- Business Schemas ---
class BusinessBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    tax_number: Optional[str] = None

class BusinessCreate(BusinessBase):
    owner_id: UUID # Required on creation

class BusinessUpdate(BusinessBase):
    name: Optional[str] = None # Make name optional for update

class BusinessInDBBase(BusinessBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    locations: List[BusinessLocation] = [] # To include related locations

    class Config:
        from_attributes = True

class Business(BusinessInDBBase):
    pass

class BusinessInDB(BusinessInDBBase):
    pass

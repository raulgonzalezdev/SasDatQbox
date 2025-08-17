from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr

# Shared properties
class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    business_id: UUID
    user_id: UUID # The user who is creating/managing this customer
    stripe_customer_id: Optional[str] = None

# Properties to receive via API on creation
class CustomerCreate(CustomerBase):
    pass

# Properties to receive via API on update
class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

# Properties shared by models stored in DB
class CustomerInDBBase(CustomerBase):
    id: UUID

    class Config:
        from_attributes = True

# Additional properties to return via API
class Customer(CustomerInDBBase):
    pass

# Additional properties stored in DB
class CustomerInDB(CustomerInDBBase):
    pass

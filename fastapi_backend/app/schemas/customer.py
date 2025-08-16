from typing import Optional
from uuid import UUID

from pydantic import BaseModel

# Shared properties
class CustomerBase(BaseModel):
    stripe_customer_id: Optional[str] = None

# Properties to receive via API on creation
class CustomerCreate(CustomerBase):
    id: UUID # Customer ID is linked to User ID

# Properties to receive via API on update
class CustomerUpdate(CustomerBase):
    pass # No specific update fields beyond base for now

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

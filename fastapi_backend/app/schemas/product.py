from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class ProductBase(BaseModel):
    name: str = Field(..., description="Name of the product")
    description: Optional[str] = None
    price: float = Field(..., gt=0, description="Price of the product")
    sku: Optional[str] = None # Stock Keeping Unit

class ProductCreate(ProductBase):
    business_id: UUID

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    sku: Optional[str] = None

class ProductInDBBase(ProductBase):
    id: UUID
    business_id: UUID

    class Config:
        from_attributes = True

class Product(ProductInDBBase):
    pass

class ProductInDB(ProductInDBBase):
    pass

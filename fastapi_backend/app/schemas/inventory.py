from typing import Optional, List
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

# --- Inventory Schemas ---
class InventoryBase(BaseModel):
    product_id: UUID
    location_id: UUID
    quantity: int = Field(..., ge=0)

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(InventoryBase):
    product_id: Optional[UUID] = None
    location_id: Optional[UUID] = None
    quantity: Optional[int] = Field(None, ge=0)

class InventoryInDBBase(InventoryBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Inventory(InventoryInDBBase):
    pass

class InventoryInDB(InventoryInDBBase):
    pass

# --- StockTransfer Schemas ---
class StockTransferBase(BaseModel):
    business_id: UUID
    from_location_id: UUID
    to_location_id: UUID
    status: str = "pending" # Default status
    notes: Optional[str] = None

class StockTransferCreate(StockTransferBase):
    pass

class StockTransferUpdate(StockTransferBase):
    business_id: Optional[UUID] = None
    from_location_id: Optional[UUID] = None
    to_location_id: Optional[UUID] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class StockTransferInDBBase(StockTransferBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StockTransfer(StockTransferInDBBase):
    pass

class StockTransferInDB(StockTransferInDBBase):
    pass

# --- StockTransferItem Schemas ---
class StockTransferItemBase(BaseModel):
    transfer_id: UUID
    product_id: UUID
    quantity: int = Field(..., ge=1)

class StockTransferItemCreate(StockTransferItemBase):
    pass

class StockTransferItemUpdate(StockTransferItemBase):
    transfer_id: Optional[UUID] = None
    product_id: Optional[UUID] = None
    quantity: Optional[int] = Field(None, ge=1)

class StockTransferItemInDBBase(StockTransferItemBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StockTransferItem(StockTransferItemInDBBase):
    pass

class StockTransferItemInDB(StockTransferItemInDBBase):
    pass

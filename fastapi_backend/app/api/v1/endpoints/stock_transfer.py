from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db
from app.schemas.inventory import (
    StockTransfer, StockTransferCreate, StockTransferUpdate,
    StockTransferItem, StockTransferItemCreate
)
from app.services.inventory_service import InventoryService
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/stock-transfers/", response_model=StockTransfer, status_code=status.HTTP_201_CREATED)
def create_stock_transfer(
    transfer_in: StockTransferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inventory_service = InventoryService(db)
    return inventory_service.create_stock_transfer(transfer_in=transfer_in)

@router.get("/stock-transfers/", response_model=List[StockTransfer])
def read_stock_transfers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    inventory_service = InventoryService(db)
    transfers = inventory_service.get_stock_transfers(skip=skip, limit=limit)
    return transfers

@router.put("/stock-transfers/{transfer_id}", response_model=StockTransfer)
def update_stock_transfer(
    transfer_id: UUID,
    transfer_in: StockTransferUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inventory_service = InventoryService(db)
    updated_transfer = inventory_service.update_stock_transfer(transfer_id=transfer_id, transfer_in=transfer_in)
    if not updated_transfer:
        raise HTTPException(status_code=404, detail="Stock transfer not found")
    return updated_transfer

@router.post("/stock-transfer-items/", response_model=StockTransferItem, status_code=status.HTTP_201_CREATED)
def create_stock_transfer_item(
    item_in: StockTransferItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inventory_service = InventoryService(db)
    return inventory_service.create_stock_transfer_item(item_in=item_in)

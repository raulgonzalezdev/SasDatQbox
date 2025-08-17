from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db
from app.schemas.inventory import Inventory, InventoryCreate, InventoryUpdate
from app.services.inventory_service import InventoryService
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=Inventory, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    item_in: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inventory_service = InventoryService(db)
    return inventory_service.create_inventory_item(item_in=item_in)

@router.get("/", response_model=List[Inventory])
def read_inventory_items(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    inventory_service = InventoryService(db)
    items = inventory_service.get_inventory_items(skip=skip, limit=limit)
    return items

@router.get("/by_location_product/", response_model=Inventory)
def read_inventory_item_by_location_and_product(
    location_id: UUID,
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inventory_service = InventoryService(db)
    item = inventory_service.get_inventory_item_by_product_and_location(product_id=product_id, location_id=location_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item

@router.delete("/{item_id}", response_model=Inventory)
def delete_inventory_item(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inventory_service = InventoryService(db)
    deleted_item = inventory_service.delete_inventory_item(item_id=item_id)
    if deleted_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return deleted_item

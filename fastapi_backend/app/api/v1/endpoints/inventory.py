from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db, get_current_active_user, get_current_active_admin
from app.schemas.inventory import Inventory, InventoryCreate, InventoryUpdate
from app.services.inventory_service import InventoryService
from app.services.business_service import BusinessService # Import BusinessService
from app.models.user import User as DBUser # Import DBUser for type hinting

router = APIRouter(
    tags=["Inventory"], # Add tag
    responses={404: {"description": "Not found"}},
)

async def get_business_id_from_inventory_item(
    item_id: UUID, db: Session = Depends(get_db)
) -> UUID:
    inventory_service = InventoryService(db)
    business_service = BusinessService(db)
    item = inventory_service.get_inventory_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    location = business_service.get_business_location(item.location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Associated business location not found")
    
    return location.business_id

@router.post("/", response_model=Inventory, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    item_in: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    inventory_service = InventoryService(db)
    business_service = BusinessService(db)

    # Check if the user owns the business associated with the location
    location = business_service.get_business_location(item_in.location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Business location not found")
    
    business = business_service.get_business(location.business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Associated business not found")

    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to create inventory for this business")

    return inventory_service.create_inventory_item(item_in=item_in)

@router.get("/", response_model=List[Inventory])
def read_inventory_items(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: DBUser = Depends(get_current_active_admin) # Only admins can view all inventory items
):
    inventory_service = InventoryService(db)
    items = inventory_service.get_inventory_items(skip=skip, limit=limit)
    return items

@router.get("/{item_id}", response_model=Inventory)
def read_inventory_item(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    inventory_service = InventoryService(db)
    item = inventory_service.get_inventory_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    # Add authorization check if needed
    return item

@router.get("/by_location_product/", response_model=Inventory)
def read_inventory_item_by_location_and_product(
    location_id: UUID,
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    inventory_service = InventoryService(db)
    business_service = BusinessService(db)

    # Check if the user owns the business associated with the location
    location = business_service.get_business_location(location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Business location not found")
    
    business = business_service.get_business(location.business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Associated business not found")

    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view inventory for this business")

    item = inventory_service.get_inventory_item_by_product_and_location(product_id=product_id, location_id=location_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item

@router.put("/{item_id}", response_model=Inventory)
async def update_inventory_item(
    item_id: UUID,
    item_in: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user),
    business_id: UUID = Depends(get_business_id_from_inventory_item) # Make it a dependency
):
    inventory_service = InventoryService(db)
    business_service = BusinessService(db)

    # Check if the user owns the business associated with the inventory item
    business = business_service.get_business(business_id) # business_id is now resolved by FastAPI
    if business is None:
        raise HTTPException(status_code=404, detail="Associated business not found")

    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update inventory for this business")

    updated_item = inventory_service.update_inventory_item(item_id=item_id, item_in=item_in)
    if updated_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return updated_item

@router.delete("/{item_id}", response_model=Inventory)
async def delete_inventory_item(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_admin), # Only admins can delete inventory items
    business_id: UUID = Depends(get_business_id_from_inventory_item) # Make it a dependency
):
    inventory_service = InventoryService(db)
    business_service = BusinessService(db)

    # Check if the user owns the business associated with the inventory item (even if admin, for logging/auditing)
    business = business_service.get_business(business_id) # business_id is now resolved by FastAPI
    if business is None:
        raise HTTPException(status_code=404, detail="Associated business not found")

    deleted_item = inventory_service.delete_inventory_item(item_id=item_id)
    if deleted_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return deleted_item

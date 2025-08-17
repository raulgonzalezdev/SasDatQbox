from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.inventory import Inventory, StockTransfer, StockTransferItem
from app.schemas.inventory import (
    InventoryCreate, InventoryUpdate,
    StockTransferCreate, StockTransferUpdate,
    StockTransferItemCreate, StockTransferItemUpdate
)
from uuid import UUID

class InventoryService:
    def __init__(self, db: Session):
        self.db = db

    # --- Inventory CRUD ---
    def get_inventory_item(self, item_id: UUID) -> Inventory | None:
        return self.db.query(Inventory).filter(Inventory.id == item_id).first()

    def get_inventory_item_by_product_and_location(self, product_id: UUID, location_id: UUID) -> Inventory | None:
        return self.db.query(Inventory).filter(
            Inventory.product_id == product_id, 
            Inventory.location_id == location_id
        ).first()

    def get_inventory_items(self, skip: int = 0, limit: int = 100) -> list[Inventory]:
        return self.db.query(Inventory).offset(skip).limit(limit).all()

    def create_inventory_item(self, item_in: InventoryCreate) -> Inventory:
        db_item = Inventory(
            product_id=item_in.product_id,
            location_id=item_in.location_id,
            quantity=item_in.quantity
        )
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def update_inventory_item(self, item_id: UUID, item_in: InventoryUpdate) -> Inventory | None:
        db_item = self.get_inventory_item(item_id)
        if not db_item:
            return None
        
        update_data = item_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def delete_inventory_item(self, item_id: UUID) -> Inventory | None:
        db_item = self.get_inventory_item(item_id)
        if not db_item:
            return None
        self.db.delete(db_item)
        self.db.commit()
        return db_item

    # --- StockTransfer CRUD ---
    def get_stock_transfer(self, transfer_id: UUID) -> StockTransfer | None:
        return self.db.query(StockTransfer).filter(StockTransfer.id == transfer_id).first()

    def get_stock_transfers(self, skip: int = 0, limit: int = 100) -> list[StockTransfer]:
        return self.db.query(StockTransfer).offset(skip).limit(limit).all()

    def create_stock_transfer(self, transfer_in: StockTransferCreate) -> StockTransfer:
        db_transfer = StockTransfer(
            business_id=transfer_in.business_id,
            from_location_id=transfer_in.from_location_id,
            to_location_id=transfer_in.to_location_id,
            status=transfer_in.status,
            notes=transfer_in.notes
        )
        self.db.add(db_transfer)
        self.db.commit()
        self.db.refresh(db_transfer)
        return db_transfer

    def update_stock_transfer(self, transfer_id: UUID, transfer_in: StockTransferUpdate) -> StockTransfer | None:
        db_transfer = self.get_stock_transfer(transfer_id)
        if not db_transfer:
            return None

        update_data = transfer_in.model_dump(exclude_unset=True)
        
        if update_data.get("status") == "completed" and db_transfer.status != "completed":
            print(f"--- PROCESSING TRANSFER {transfer_id} ---")
            transfer_items = self.get_stock_transfer_items(transfer_id=transfer_id)
            if not transfer_items:
                raise HTTPException(status_code=404, detail="No items found for this transfer.")

            for item in transfer_items:
                print(f"  - Processing item {item.product_id}, quantity {item.quantity}")
                from_inventory = self.get_inventory_item_by_product_and_location(item.product_id, db_transfer.from_location_id)
                
                if not from_inventory or from_inventory.quantity < item.quantity:
                    self.db.rollback()
                    raise HTTPException(status_code=400, detail=f"Insufficient stock for product {item.product_id}")
                
                print(f"    - Source inventory (before): {from_inventory.quantity}")
                from_inventory.quantity -= item.quantity
                print(f"    - Source inventory (after): {from_inventory.quantity}")
                self.db.add(from_inventory)

                to_inventory = self.get_inventory_item_by_product_and_location(item.product_id, db_transfer.to_location_id)
                if to_inventory:
                    print(f"    - Destination inventory (before): {to_inventory.quantity}")
                    to_inventory.quantity += item.quantity
                    print(f"    - Destination inventory (after): {to_inventory.quantity}")
                    self.db.add(to_inventory)
                else:
                    print(f"    - Destination inventory not found. Creating with quantity {item.quantity}")
                    new_inventory_item = Inventory(product_id=item.product_id, location_id=db_transfer.to_location_id, quantity=item.quantity)
                    self.db.add(new_inventory_item)

        for key, value in update_data.items():
            setattr(db_transfer, key, value)
        
        self.db.add(db_transfer)
        self.db.commit()
        self.db.refresh(db_transfer)
        return db_transfer

    def delete_stock_transfer(self, transfer_id: UUID) -> StockTransfer | None:
        db_transfer = self.get_stock_transfer(transfer_id)
        if not db_transfer:
            return None
        self.db.delete(db_transfer)
        self.db.commit()
        return db_transfer

    # --- StockTransferItem CRUD ---
    def get_stock_transfer_item(self, item_id: UUID) -> StockTransferItem | None:
        return self.db.query(StockTransferItem).filter(StockTransferItem.id == item_id).first()

    def get_stock_transfer_items(self, transfer_id: UUID, skip: int = 0, limit: int = 100) -> list[StockTransferItem]:
        return self.db.query(StockTransferItem).filter(StockTransferItem.transfer_id == transfer_id).offset(skip).limit(limit).all()

    def create_stock_transfer_item(self, item_in: StockTransferItemCreate) -> StockTransferItem:
        db_item = StockTransferItem(
            transfer_id=item_in.transfer_id,
            product_id=item_in.product_id,
            quantity=item_in.quantity
        )
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def update_stock_transfer_item(self, item_id: UUID, item_in: StockTransferItemUpdate) -> StockTransferItem | None:
        db_item = self.get_stock_transfer_item(item_id)
        if not db_item:
            return None
        
        update_data = item_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def delete_stock_transfer_item(self, item_id: UUID) -> StockTransferItem | None:
        db_item = self.get_stock_transfer_item(item_id)
        if not db_item:
            return None
        self.db.delete(db_item)
        self.db.commit()
        return db_item

import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Inventory(Base):
    __tablename__ = "inventory"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey('pos.products.id'), nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey('pos.business_locations.id'), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class StockTransfer(Base):
    __tablename__ = "stock_transfers"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey('pos.businesses.id'), nullable=False)
    from_location_id = Column(UUID(as_uuid=True), ForeignKey('pos.business_locations.id'), nullable=False)
    to_location_id = Column(UUID(as_uuid=True), ForeignKey('pos.business_locations.id'), nullable=False)
    status = Column(String, nullable=False, default='pending')
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class StockTransferItem(Base):
    __tablename__ = "stock_transfer_items"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transfer_id = Column(UUID(as_uuid=True), ForeignKey('pos.stock_transfers.id'), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey('pos.products.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

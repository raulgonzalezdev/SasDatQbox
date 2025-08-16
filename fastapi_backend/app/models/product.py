import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey('pos.businesses.id'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    sku = Column(String)
    barcode = Column(String)
    unit_price = Column(Numeric(10, 2), nullable=False)
    cost_price = Column(Numeric(10, 2))
    tax_rate = Column(Numeric(5, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    business = relationship("Business")

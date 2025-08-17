import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)

    # Foreign Keys
    business_id = Column(UUID(as_uuid=True), ForeignKey("pos.businesses.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("pos.users.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    business = relationship("Business", back_populates="customers")
    user = relationship("User") # Assuming a simple relationship for now

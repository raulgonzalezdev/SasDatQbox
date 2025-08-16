import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), ForeignKey('pos.users.id'), primary_key=True)
    stripe_customer_id = Column(String)

    user = relationship("User", backref="customer", uselist=False)

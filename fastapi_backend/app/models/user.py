import uuid
from sqlalchemy import Column, String, DateTime, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum

class UserRole(str, enum.Enum):
    DOCTOR = "doctor"
    PATIENT = "patient"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False) # Añadir email como campo único y no nulo
    hashed_password = Column(String, nullable=False) # Campo para la contraseña hasheada
    role = Column(Enum(UserRole), nullable=False, default=UserRole.PATIENT)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    avatar_url = Column(String)
    billing_address = Column(JSON)
    payment_method = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    customer = relationship("Customer", back_populates="user", uselist=False)
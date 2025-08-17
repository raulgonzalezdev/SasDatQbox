from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid
from sqlalchemy.sql import func
import enum

class AppointmentStatus(str, enum.Enum):
    PENDING_PAYMENT = "pending_payment"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class DocumentType(str, enum.Enum):
    PRESCRIPTION = "prescription"
    EXAM_ORDER = "exam_order"
    EXAM_RESULT = "exam_result"
    MEDICAL_REPORT = "medical_report"


class Appointment(Base):
    __tablename__ = "appointments"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("pos.users.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("pos.patients.id"), nullable=False)
    status = Column(Enum(AppointmentStatus), nullable=False, default=AppointmentStatus.PENDING_PAYMENT)
    appointment_datetime = Column(DateTime(timezone=True), nullable=False)
    reason = Column(Text, nullable=True)
    stripe_payment_intent_id = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    doctor = relationship("User")
    patient = relationship("Patient")
    documents = relationship("AppointmentDocument", back_populates="appointment")


class AppointmentDocument(Base):
    __tablename__ = "appointment_documents"
    __table_args__ = {'schema': 'pos'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("pos.appointments.id"), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    content = Column(Text, nullable=False)
    # In the future, we can add a pgvector column here
    # embedding = Column(Vector(384), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    appointment = relationship("Appointment", back_populates="documents")

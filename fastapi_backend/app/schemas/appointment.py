
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.appointment import AppointmentStatus, DocumentType # Import enums

# Document Schemas
class AppointmentDocumentBase(BaseModel):
    document_type: DocumentType
    content: str

class AppointmentDocumentCreate(AppointmentDocumentBase):
    appointment_id: UUID

class AppointmentDocumentUpdate(BaseModel):
    content: Optional[str] = None

class AppointmentDocument(AppointmentDocumentBase):
    id: UUID
    appointment_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentBase(BaseModel):
    doctor_id: UUID
    patient_id: UUID
    status: Optional[AppointmentStatus] = AppointmentStatus.PENDING_PAYMENT
    appointment_datetime: datetime
    reason: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    status: Optional[AppointmentStatus] = None
    appointment_datetime: Optional[datetime] = None
    reason: Optional[str] = None

class Appointment(AppointmentBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    documents: List[AppointmentDocument] = []

    class Config:
        from_attributes = True

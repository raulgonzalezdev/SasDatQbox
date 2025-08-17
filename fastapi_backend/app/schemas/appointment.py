
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.appointment import AppointmentStatus, DocumentType # Import enums
from .patient import Patient # Import Patient schema

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
# Shared properties
class AppointmentBase(BaseModel):
    patient_id: UUID
    appointment_datetime: datetime
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    reason: Optional[str] = None
    notes: Optional[str] = None

# Properties to receive on appointment creation
class AppointmentCreate(AppointmentBase):
    # doctor_id will be inferred from the token
    pass

# Internal schema for service layer
class AppointmentCreateInternal(AppointmentBase):
    doctor_id: UUID

# Properties to receive on appointment update
class AppointmentUpdate(BaseModel):
    appointment_datetime: Optional[datetime] = None
    status: Optional[AppointmentStatus] = None
    reason: Optional[str] = None
    notes: Optional[str] = None

# Properties shared by models in DB
class AppointmentInDBBase(AppointmentBase):
    id: UUID
    doctor_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    patient: Patient # Nest patient details

    class Config:
        from_attributes = True

# Properties to return to client
class Appointment(AppointmentInDBBase):
    pass

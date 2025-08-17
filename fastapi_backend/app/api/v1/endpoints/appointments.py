
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db, get_current_active_user
from app.schemas.appointment import (
    Appointment, AppointmentCreate, AppointmentUpdate,
    AppointmentDocument, AppointmentDocumentCreate, AppointmentDocumentUpdate
)
from app.services.appointment_service import AppointmentService
from app.models.user import User as DBUser, UserRole

router = APIRouter(
    tags=["Appointments"],
    responses={404: {"description": "Not found"}},
)

# Appointments
@router.post("/", response_model=Appointment, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment_in: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    # Any authenticated user can create an appointment for themselves
    if str(current_user.id) != str(appointment_in.patient_id) and current_user.role != UserRole.ADMIN:
         raise HTTPException(status_code=403, detail="Forbidden")
    service = AppointmentService(db)
    return service.create_appointment(appointment_in=appointment_in)

@router.get("/", response_model=List[Appointment])
def read_appointments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: DBUser = Depends(get_current_active_user)
):
    service = AppointmentService(db)
    if current_user.role == UserRole.ADMIN:
        return service.get_appointments(skip=skip, limit=limit)
    # Non-admins can only see their own appointments
    # This requires filtering logic in the service, which we'll add
    raise HTTPException(status_code=501, detail="Not implemented for non-admins yet")

@router.get("/{appointment_id}", response_model=Appointment)
def read_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    service = AppointmentService(db)
    appointment = service.get_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(current_user.id) not in [str(appointment.patient_id), str(appointment.doctor_id)] and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    return appointment

@router.put("/{appointment_id}", response_model=Appointment)
def update_appointment(
    appointment_id: UUID,
    appointment_in: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    service = AppointmentService(db)
    appointment = service.get_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(current_user.id) != str(appointment.doctor_id) and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.update_appointment(appointment_id=appointment_id, appointment_in=appointment_in)

# Appointment Documents
@router.post("/documents/", response_model=AppointmentDocument, status_code=status.HTTP_201_CREATED)
def create_appointment_document(
    doc_in: AppointmentDocumentCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    service = AppointmentService(db)
    # Check if user is part of the appointment
    appointment = service.get_appointment(doc_in.appointment_id)
    if not appointment or (str(current_user.id) not in [str(appointment.patient_id), str(appointment.doctor_id)] and current_user.role != UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.create_appointment_document(doc_in=doc_in)

@router.get("/{appointment_id}/documents/", response_model=List[AppointmentDocument])
def read_appointment_documents(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    service = AppointmentService(db)
    appointment = service.get_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(current_user.id) not in [str(appointment.patient_id), str(appointment.doctor_id)] and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.get_appointment_documents(appointment_id=appointment_id)

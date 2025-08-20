
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Any, Optional

from app.dependencies import get_db, get_current_active_user
from app.schemas.appointment import (
    Appointment, AppointmentCreate, AppointmentUpdate,
    AppointmentDocument, AppointmentDocumentCreate, AppointmentDocumentUpdate,
    AppointmentCreateInternal
)
from app.services.appointment_service import AppointmentService
from app.models.user import User as DBUser, UserRole

router = APIRouter(
    tags=["Appointments"],
    responses={404: {"description": "Not found"}},
)

# Función helper para parsear datos de JSON o form-urlencoded
async def parse_request_data(request: Request, model_class):
    """Parse data from JSON or form-urlencoded request"""
    ct = (request.headers.get("content-type") or "").lower()
    
    if ct.startswith("application/x-www-form-urlencoded") or ct.startswith("multipart/form-data"):
        form = await request.form()
        # Convert form data to dict
        data = {}
        for key, value in form.items():
            data[key] = value
        return model_class(**data)
    else:
        # Default to JSON
        data = await request.json()
        return model_class(**data)

# Appointments
@router.post("/", response_model=Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
) -> Any:
    """
    Create a new appointment for the current user (doctor).
    Accepts JSON or form-urlencoded data.
    """
    appointment_in = await parse_request_data(request, AppointmentCreate)
    service = AppointmentService(db)
    appointment_internal = AppointmentCreateInternal(
        **appointment_in.model_dump(),
        doctor_id=current_user.id
    )
    return service.create_appointment(appointment_in=appointment_internal)

@router.get("/", response_model=List[Appointment])
def read_appointments(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve appointments for the current user.
    """
    service = AppointmentService(db)
    return service.get_appointments_by_user(user_id=current_user.id)

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
async def update_appointment(
    appointment_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Update an appointment.
    Accepts JSON or form-urlencoded data.
    """
    appointment_in = await parse_request_data(request, AppointmentUpdate)
    service = AppointmentService(db)
    appointment = service.get_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(current_user.id) != str(appointment.doctor_id) and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.update_appointment(appointment_id=appointment_id, appointment_in=appointment_in)

@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    service = AppointmentService(db)
    appointment = service.get_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(current_user.id) != str(appointment.doctor_id) and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    service.delete_appointment(appointment_id=appointment_id)
    return {"message": "Appointment deleted successfully"}

@router.post("/{appointment_id}/confirm", response_model=Appointment)
def confirm_appointment(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    service = AppointmentService(db)
    appointment = service.get_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(current_user.id) != str(appointment.doctor_id) and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.confirm_appointment(appointment_id=appointment_id)

@router.post("/{appointment_id}/cancel", response_model=Appointment)
def cancel_appointment(
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
    return service.cancel_appointment(appointment_id=appointment_id)

@router.post("/{appointment_id}/reschedule", response_model=Appointment)
async def reschedule_appointment(
    appointment_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Reschedule an appointment.
    Accepts JSON or form-urlencoded data.
    """
    appointment_in = await parse_request_data(request, AppointmentUpdate)
    service = AppointmentService(db)
    appointment = service.get_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if str(current_user.id) not in [str(appointment.patient_id), str(appointment.doctor_id)] and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.reschedule_appointment(appointment_id=appointment_id, appointment_in=appointment_in)

# Appointment Documents
@router.post("/documents/", response_model=AppointmentDocument, status_code=status.HTTP_201_CREATED)
async def create_appointment_document(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create an appointment document.
    Accepts JSON or form-urlencoded data.
    """
    doc_in = await parse_request_data(request, AppointmentDocumentCreate)
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

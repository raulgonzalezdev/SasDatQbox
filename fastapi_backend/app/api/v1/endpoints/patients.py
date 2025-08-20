
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db, get_current_active_user
from app.schemas.patient import Patient, PatientCreate, PatientUpdate, PatientCreateInternal
from app.services.patient_service import PatientService
from app.models.user import User as DBUser, UserRole

router = APIRouter(
    tags=["Patients"],
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

@router.post("/", response_model=Patient, status_code=status.HTTP_201_CREATED)
async def create_patient(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create a new patient for the current user.
    Accepts JSON or form-urlencoded data.
    """
    patient_in = await parse_request_data(request, PatientCreate)
    patient_service = PatientService(db)
    
    patient_internal_in = PatientCreateInternal(
        **patient_in.model_dump(),
        user_id=current_user.id
    )
    
    return patient_service.create_patient(patient_in=patient_internal_in)

@router.get("/", response_model=List[Patient])
def read_patients(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: DBUser = Depends(get_current_active_user)
):
    # Only ADMIN and DOCTOR can see all patients
    if current_user.role not in [UserRole.ADMIN, UserRole.DOCTOR]:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = PatientService(db)
    return service.get_patients(skip=skip, limit=limit)

@router.get("/search", response_model=List[Patient])
def search_patients(
    q: str = Query(..., description="Search term for patient name or email"),
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    # Only ADMIN and DOCTOR can search patients
    if current_user.role not in [UserRole.ADMIN, UserRole.DOCTOR]:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = PatientService(db)
    return service.search_patients(search_term=q)

@router.get("/{patient_id}", response_model=Patient)
def read_patient(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    service = PatientService(db)
    patient = service.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    # User can see their own patient data, or ADMIN/DOCTOR can see any
    if str(current_user.id) != str(patient.user_id) and current_user.role not in [UserRole.ADMIN, UserRole.DOCTOR]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return patient

@router.get("/{patient_id}/medical-history", response_model=dict)
def get_patient_medical_history(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    service = PatientService(db)
    patient = service.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    # User can see their own patient data, or ADMIN/DOCTOR can see any
    if str(current_user.id) != str(patient.user_id) and current_user.role not in [UserRole.ADMIN, UserRole.DOCTOR]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.get_patient_medical_history(patient_id=patient_id)

@router.put("/{patient_id}", response_model=Patient)
async def update_patient(
    patient_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Update a patient.
    Accepts JSON or form-urlencoded data.
    """
    patient_in = await parse_request_data(request, PatientUpdate)
    service = PatientService(db)
    patient = service.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    # User can update their own patient data, or ADMIN/DOCTOR can update any
    if str(current_user.id) != str(patient.user_id) and current_user.role not in [UserRole.ADMIN, UserRole.DOCTOR]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return service.update_patient(patient_id=patient_id, patient_in=patient_in)

@router.delete("/{patient_id}", response_model=Patient)
def delete_patient(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    # Only ADMIN can delete patients
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = PatientService(db)
    deleted_patient = service.delete_patient(patient_id)
    if not deleted_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return deleted_patient


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db, get_current_active_user
from app.schemas.patient import Patient, PatientCreate, PatientUpdate
from app.services.patient_service import PatientService
from app.models.user import User as DBUser, UserRole

router = APIRouter(
    tags=["Patients"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Patient, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    # Only ADMIN or the user themselves can create a patient profile
    if str(current_user.id) != str(patient_in.user_id) and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = PatientService(db)
    return service.create_patient(patient_in=patient_in)

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

@router.put("/{patient_id}", response_model=Patient)
def update_patient(
    patient_id: UUID,
    patient_in: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
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

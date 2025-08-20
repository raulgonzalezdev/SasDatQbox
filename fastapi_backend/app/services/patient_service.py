
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from sqlalchemy import or_

from app.models.patient import Patient
from app.schemas.patient import PatientCreateInternal, PatientUpdate

class PatientService:
    def __init__(self, db: Session):
        self.db = db

    def get_patient(self, patient_id: UUID):
        return self.db.query(Patient).filter(Patient.id == patient_id).first()

    def get_patients(self, skip: int = 0, limit: int = 100):
        return self.db.query(Patient).offset(skip).limit(limit).all()

    def get_patients_by_user(self, user_id: UUID, skip: int = 0, limit: int = 100):
        return self.db.query(Patient).filter(Patient.user_id == user_id).offset(skip).limit(limit).all()

    def search_patients(self, search_term: str):
        return self.db.query(Patient).filter(
            or_(
                Patient.first_name.ilike(f"%{search_term}%"),
                Patient.last_name.ilike(f"%{search_term}%"),
                Patient.email.ilike(f"%{search_term}%")
            )
        ).all()

    def create_patient(self, patient_in: PatientCreateInternal):
        db_patient = Patient(**patient_in.model_dump())
        self.db.add(db_patient)
        self.db.commit()
        self.db.refresh(db_patient)
        return db_patient

    def update_patient(self, patient_id: UUID, patient_in: PatientUpdate):
        db_patient = self.get_patient(patient_id)
        if not db_patient:
            return None
        update_data = patient_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_patient, key, value)
        self.db.add(db_patient)
        self.db.commit()
        self.db.refresh(db_patient)
        return db_patient

    def delete_patient(self, patient_id: UUID):
        db_patient = self.get_patient(patient_id)
        if not db_patient:
            return None
        self.db.delete(db_patient)
        self.db.commit()
        return db_patient

    def get_patient_medical_history(self, patient_id: UUID):
        # Por ahora devolvemos un historial básico
        # En el futuro esto podría incluir citas, recetas, etc.
        patient = self.get_patient(patient_id)
        if not patient:
            return None
        
        return {
            "patient_id": str(patient_id),
            "medical_history": {
                "allergies": patient.allergies or [],
                "medications": patient.medications or [],
                "conditions": patient.conditions or [],
                "surgeries": patient.surgeries or [],
                "family_history": patient.family_history or {},
                "lifestyle": patient.lifestyle or {}
            },
            "last_updated": patient.updated_at.isoformat() if patient.updated_at else None
        }

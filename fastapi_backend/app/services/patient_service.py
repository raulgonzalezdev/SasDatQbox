
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.models.patient import Patient
from app.schemas.patient import PatientCreateInternal, PatientUpdate

class PatientService:
    def __init__(self, db: Session):
        self.db = db

    def get_patient(self, patient_id: UUID):
        return self.db.query(Patient).filter(Patient.id == patient_id).first()

    def get_patients_by_user(self, user_id: UUID, skip: int = 0, limit: int = 100):
        return self.db.query(Patient).filter(Patient.user_id == user_id).offset(skip).limit(limit).all()

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

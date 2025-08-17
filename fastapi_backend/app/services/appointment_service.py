
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.models.appointment import Appointment, AppointmentDocument
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentDocumentCreate, AppointmentDocumentUpdate

class AppointmentService:
    def __init__(self, db: Session):
        self.db = db

    # Appointment methods
    def create_appointment(self, appointment_in: AppointmentCreate) -> Appointment:
        db_appointment = Appointment(**appointment_in.model_dump())
        self.db.add(db_appointment)
        self.db.commit()
        self.db.refresh(db_appointment)
        return db_appointment

    def get_appointment(self, appointment_id: UUID) -> Optional[Appointment]:
        return self.db.query(Appointment).filter(Appointment.id == appointment_id).first()

    def get_appointments(self, skip: int = 0, limit: int = 100) -> List[Appointment]:
        return self.db.query(Appointment).offset(skip).limit(limit).all()

    def update_appointment(self, appointment_id: UUID, appointment_in: AppointmentUpdate) -> Optional[Appointment]:
        db_appointment = self.get_appointment(appointment_id)
        if not db_appointment:
            return None
        update_data = appointment_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_appointment, key, value)
        self.db.add(db_appointment)
        self.db.commit()
        self.db.refresh(db_appointment)
        return db_appointment

    def delete_appointment(self, appointment_id: UUID) -> Optional[Appointment]:
        db_appointment = self.get_appointment(appointment_id)
        if not db_appointment:
            return None
        self.db.delete(db_appointment)
        self.db.commit()
        return db_appointment

    # Appointment Document methods
    def create_appointment_document(self, doc_in: AppointmentDocumentCreate) -> AppointmentDocument:
        db_doc = AppointmentDocument(**doc_in.model_dump())
        self.db.add(db_doc)
        self.db.commit()
        self.db.refresh(db_doc)
        return db_doc

    def get_appointment_document(self, doc_id: UUID) -> Optional[AppointmentDocument]:
        return self.db.query(AppointmentDocument).filter(AppointmentDocument.id == doc_id).first()

    def get_appointment_documents(self, appointment_id: UUID) -> List[AppointmentDocument]:
        return self.db.query(AppointmentDocument).filter(AppointmentDocument.appointment_id == appointment_id).all()
    
    def update_appointment_document(self, doc_id: UUID, doc_in: AppointmentDocumentUpdate) -> Optional[AppointmentDocument]:
        db_doc = self.get_appointment_document(doc_id)
        if not db_doc:
            return None
        update_data = doc_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_doc, key, value)
        self.db.add(db_doc)
        self.db.commit()
        self.db.refresh(db_doc)
        return db_doc

    def delete_appointment_document(self, doc_id: UUID) -> Optional[AppointmentDocument]:
        db_doc = self.get_appointment_document(doc_id)
        if not db_doc:
            return None
        self.db.delete(db_doc)
        self.db.commit()
        return db_doc

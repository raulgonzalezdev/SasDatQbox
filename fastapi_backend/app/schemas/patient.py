
from pydantic import BaseModel
from typing import Optional, Any, Dict
from uuid import UUID
from datetime import date, datetime

# Shared properties
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    contact_info: Optional[Dict[str, Any]] = None
    medical_history: Optional[str] = None

# Properties to receive via API on creation
class PatientCreate(PatientBase):
    # user_id ya no es requerido aquí, se obtendrá del token
    pass

# Nuevo schema para uso interno del servicio
class PatientCreateInternal(PatientBase):
    user_id: UUID

# Properties to receive via API on update
class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    contact_info: Optional[Dict[str, Any]] = None
    medical_history: Optional[str] = None

# Properties shared by models stored in DB
class PatientInDBBase(PatientBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Additional properties to return via API
class Patient(PatientInDBBase):
    pass

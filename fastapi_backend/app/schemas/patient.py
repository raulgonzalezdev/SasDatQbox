
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

# Shared properties
class PatientBase(BaseModel):
    user_id: UUID
    medical_history: Optional[str] = None

# Properties to receive via API on creation
class PatientCreate(PatientBase):
    pass

# Properties to receive via API on update
class PatientUpdate(BaseModel):
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

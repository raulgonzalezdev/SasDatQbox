from pydantic import BaseModel

class DashboardStats(BaseModel):
    patient_count: int
    todays_revenue: float

    class Config:
        from_attributes = True

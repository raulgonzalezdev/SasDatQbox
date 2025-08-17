from sqlalchemy.orm import Session
from app.models.patient import Patient  # Import Patient model directly
from ..schemas.dashboard import DashboardStats

class DashboardService:
    def get_dashboard_stats(self, db: Session, user_id: str) -> DashboardStats:
        # Lógica para contar pacientes
        patient_count = db.query(Patient).filter(Patient.user_id == user_id).count()

        # Lógica para calcular ingresos (simulada por ahora)
        # En una implementación real, esto vendría de una tabla de transacciones o pagos.
        todays_revenue = 1250.75  # Valor de ejemplo

        return DashboardStats(
            patient_count=patient_count,
            todays_revenue=todays_revenue
        )

dashboard_service = DashboardService()

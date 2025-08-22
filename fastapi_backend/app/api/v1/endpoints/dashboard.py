from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....api import deps
from ....services.dashboard_service import dashboard_service
from ....schemas.dashboard import DashboardStats
from ....models.user import User

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Retrieve dashboard statistics for the current user.
    """
    stats = dashboard_service.get_dashboard_stats(db=db, user_id=str(current_user.id))
    return stats

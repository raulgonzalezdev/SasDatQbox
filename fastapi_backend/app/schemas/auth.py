from pydantic import BaseModel
from app.schemas.user import User as UserResponse

class AuthOut(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserResponse

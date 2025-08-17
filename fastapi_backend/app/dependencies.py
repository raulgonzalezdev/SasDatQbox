from typing import Generator, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User as DBUser # Alias to avoid conflict with pydantic User
from app.core.config import settings
from app.schemas.user import UserRole # Import UserRole

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False  # No lanzar error automáticamente para poder manejarlo
)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_token(request: Request, token: Optional[str] = Depends(reusable_oauth2)) -> Optional[str]:
    """
    Intenta obtener el token de la cookie 'access_token'.
    Si no está, usa el flujo de OAuth2 (cabecera Authorization).
    """
    cookie_token = request.cookies.get("access_token")
    if cookie_token:
        # FastAPI espera que el token no tenga el prefijo 'Bearer '
        return cookie_token.replace("Bearer ", "")
    return token

async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(get_token)
) -> DBUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if token is None:
        raise credentials_exception
        
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: DBUser = Depends(get_current_user),
) -> DBUser:
    # For now, all authenticated users are considered active.
    # Add logic here if you have an 'is_active' field in your User model.
    return current_user

async def get_current_active_admin(
    current_user: DBUser = Depends(get_current_user),
) -> DBUser:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

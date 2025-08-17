from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user # Corrected import for get_current_user
from app.schemas.user import UserCreate, User as UserResponse, Token
from app.services.user_service import UserService # Import the class
from app.core.security import verify_password # Removed get_password_hash as it's used in service
from app.core.config import settings
from app.core.auth import create_access_token # This needs to be implemented

router = APIRouter(
    tags=["Auth"],
    responses={401: {"description": "Unauthorized"}}
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    user_service = UserService(db)
    user = user_service.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )
    
    new_user = user_service.create_user(user_in=user_in)
    return new_user

@router.post("/login", response_model=Token)
async def login_for_access_token( # Made async
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    user = user_service.get_by_email(db, email=form_data.username)
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, # Use user.id as sub
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me( # Made async
    current_user: Annotated[UserResponse, Depends(get_current_user)] # Use UserResponse
):
    return current_user

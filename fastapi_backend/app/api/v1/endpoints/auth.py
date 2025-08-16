from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.dependencies import get_db # Corrected import
from app.schemas.user import UserCreate, User as UserResponse, Token
from app.services.user_service import UserService # Import the class
from app.core.security import verify_password, get_password_hash # Import functions directly
from app.core.config import settings
from app.api.deps import get_current_user # Assuming this is correct
from app.models.user import User
from app.core.auth import create_access_token # Assuming this will be created/used for token creation

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    user_service = UserService(db) # Instantiate the service
    db_user = user_service.get_user_by_email(email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # The create_user method in UserService already handles hashing
    new_user = user_service.create_user(user_in=user)
    return new_user

@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user_service = UserService(db) # Instantiate the service
    user = user_service.get_user_by_email(email=form_data.username)
    
    if not user or not verify_password(form_data.password, user.hashed_password): # Use hashed_password
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token( # Use create_access_token from app.core.auth
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user

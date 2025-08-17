from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user # Corrected import for get_current_user
from app.schemas.user import UserCreate, User as UserResponse, Token
from app.services.user_service import UserService # Import the class
from app.core.security import verify_password, ACCESS_TOKEN_EXPIRE_MINUTES # Removed get_password_hash as it's used in service
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
    print(f"Attempting to register user with data: {user_in.model_dump()}")
    user_service = UserService(db)
    user = user_service.get_by_email(db, email=user_in.email)
    if user:
        print("User with this email already exists.")
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )
    try:
        user = user_service.create(db, obj_in=user_in)
        print(f"User created successfully: {user.email}")
        return user
    except Exception as e:
        print(f"An error occurred during user creation: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during user creation.",
        )

@router.post("/login")
async def login_for_access_token( 
    response: Response,
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
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, 
        expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=True, # En producción, asegúrate de que sea True
        samesite='lax', # o 'strict'
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    
    return {"message": "Login successful"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logout successful"}

@router.get("/me", response_model=UserResponse)
async def read_users_me( 
    current_user: Annotated[UserResponse, Depends(get_current_user)] 
):
    return current_user

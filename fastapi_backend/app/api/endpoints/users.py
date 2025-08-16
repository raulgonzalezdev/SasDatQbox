from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.user import User, UserCreate, UserUpdate
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    db_user = user_service.get_user_by_email(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_service.create_user(user)

@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user_service = UserService(db)
    users = user_service.get_users(skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=User)
def read_user(user_id: UUID, db: Session = Depends(get_db)):
    user_service = UserService(db)
    user = user_service.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=User)
def update_user(user_id: UUID, user: UserUpdate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    db_user = user_service.update_user(user_id, user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}", response_model=User)
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    user_service = UserService(db)
    db_user = user_service.delete_user(user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

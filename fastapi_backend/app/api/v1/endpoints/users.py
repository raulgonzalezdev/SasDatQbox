from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_active_user # Import get_current_active_user
from app.schemas.user import User, UserUpdate, UserCreate, UserRole # Import UserCreate and UserRole
from app.services.user_service import UserService
from app.models.user import User as DBUser # Import DBUser for type hinting in dependencies

router = APIRouter(
    tags=["Users"], # Capitalized tag
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user) # Only authenticated users can create
):
    user_service = UserService(db)
    # Only ADMIN can create users with a specific role, otherwise default to PATIENT
    if user.role and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to set user roles."
        )
    db_user = user_service.create_user(user)
    return db_user

@router.get("/", response_model=List[User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user) # Secure this endpoint
):
    # Only ADMIN can view all users
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view all users."
        )
    user_service = UserService(db)
    users = user_service.get_users(skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=User)
def read_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user) # Secure this endpoint
):
    user_service = UserService(db)
    user = user_service.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Users can only view their own profile, ADMIN can view any
    if str(current_user.id) != str(user_id) and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this user's profile."
        )
    return user

@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: UUID,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user) # Secure this endpoint
):
    user_service = UserService(db)
    db_user = user_service.get_user(user_id) # Get user to check ownership/roles

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Users can only update their own profile, ADMIN can update any
    if str(current_user.id) != str(user_id) and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's profile."
        )
    
    # Only ADMIN can change roles
    if user.role is not None and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to change user roles."
        )

    db_user = user_service.update_user(user_id, user)
    return db_user

@router.delete("/{user_id}", response_model=User)
def delete_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user) # Secure this endpoint
):
    user_service = UserService(db)
    db_user = user_service.get_user(user_id) # Get user to check ownership/roles

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Only ADMIN can delete users
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete users."
        )
    
    # Prevent admin from deleting themselves
    if str(current_user.id) == str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins cannot delete their own account."
        )

    db_user = user_service.delete_user(user_id)
    return db_user

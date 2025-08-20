from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserRole # Import UserRole
from app.core.security import get_password_hash
from uuid import UUID
from app.services.customer_service import CustomerService
from app.schemas.customer import CustomerCreate
from typing import Optional
from app.crud.base import CRUDBase

class UserService(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: User, obj_in: UserUpdate) -> User:
        """Update user with proper password handling"""
        update_data = obj_in.dict(exclude_unset=True)
        
        # Handle password hashing if password is being updated
        if "password" in update_data and update_data["password"]:
            update_data["hashed_password"] = get_password_hash(update_data["password"])
            del update_data["password"]
        
        # Remove hashed_password from update_data if it's not being set
        if "hashed_password" not in update_data:
            update_data.pop("hashed_password", None)
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def is_active(self, user: User) -> bool:
        return True # Implement logic for user activation status if needed

user_service = UserService(User)

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash
from uuid import UUID

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user(self, user_id: UUID) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def create_user(self, user_in: UserCreate) -> User:
        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            email=user_in.email,
            hashed_password=hashed_password,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            phone=user_in.phone,
            avatar_url=user_in.avatar_url,
            billing_address=user_in.billing_address,
            payment_method=user_in.payment_method
        )
        try:
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Email already registered")

    def update_user(self, user_id: UUID, user_in: UserUpdate) -> User | None:
        db_user = self.get_user(user_id)
        if not db_user:
            return None
        
        update_data = user_in.model_dump(exclude_unset=True)
        if "password" in update_data and update_data["password"]:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
        for key, value in update_data.items():
            setattr(db_user, key, value)
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def delete_user(self, user_id: UUID) -> User | None:
        db_user = self.get_user(user_id)
        if not db_user:
            return None
        self.db.delete(db_user)
        self.db.commit()
        return db_user

    def get_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        return self.db.query(User).offset(skip).limit(limit).all()

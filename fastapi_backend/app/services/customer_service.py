from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate
from uuid import UUID

class CustomerService:
    def __init__(self, db: Session):
        self.db = db

    def get_customer(self, customer_id: UUID) -> Customer | None:
        return self.db.query(Customer).filter(Customer.id == customer_id).first()

    def create_customer(self, customer_in: CustomerCreate) -> Customer:
        db_customer = Customer(
            id=customer_in.id,
            stripe_customer_id=customer_in.stripe_customer_id
        )
        self.db.add(db_customer)
        self.db.commit()
        self.db.refresh(db_customer)
        return db_customer

    def update_customer(self, customer_id: UUID, customer_in: CustomerUpdate) -> Customer | None:
        db_customer = self.get_customer(customer_id)
        if not db_customer:
            return None
        
        update_data = customer_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_customer, key, value)
        
        self.db.add(db_customer)
        self.db.commit()
        self.db.refresh(db_customer)
        return db_customer

    def delete_customer(self, customer_id: UUID) -> Customer | None:
        db_customer = self.get_customer(customer_id)
        if not db_customer:
            return None
        self.db.delete(db_customer)
        self.db.commit()
        return db_customer

    def get_customers(self, skip: int = 0, limit: int = 100) -> list[Customer]:
        return self.db.query(Customer).offset(skip).limit(limit).all()

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.customer import Customer, CustomerCreate, CustomerUpdate
from app.services.customer_service import CustomerService

router = APIRouter(
    prefix="/customers",
    tags=["customers"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Customer, status_code=status.HTTP_201_CREATED)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    customer_service = CustomerService(db)
    db_customer = customer_service.get_customer(customer.id)
    if db_customer:
        raise HTTPException(status_code=400, detail="Customer with this ID already exists")
    return customer_service.create_customer(customer)

@router.get("/", response_model=List[Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customer_service = CustomerService(db)
    customers = customer_service.get_customers(skip=skip, limit=limit)
    return customers

@router.get("/{customer_id}", response_model=Customer)
def read_customer(customer_id: UUID, db: Session = Depends(get_db)):
    customer_service = CustomerService(db)
    customer = customer_service.get_customer(customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.put("/{customer_id}", response_model=Customer)
def update_customer(customer_id: UUID, customer: CustomerUpdate, db: Session = Depends(get_db)):
    customer_service = CustomerService(db)
    db_customer = customer_service.update_customer(customer_id, customer)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@router.delete("/{customer_id}", response_model=Customer)
def delete_customer(customer_id: UUID, db: Session = Depends(get_db)):
    customer_service = CustomerService(db)
    db_customer = customer_service.delete_customer(customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

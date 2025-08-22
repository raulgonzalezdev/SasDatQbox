from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_active_user, get_current_active_admin
from app.schemas.customer import Customer, CustomerCreate, CustomerUpdate
from app.services.customer_service import CustomerService
from app.models.user import User as DBUser # Import DBUser for type hinting

router = APIRouter(
    tags=["Customers"],
    responses={404: {"description": "Not found"}},
)

# Función helper para parsear datos de JSON o form-urlencoded
async def parse_request_data(request: Request, model_class):
    """Parse data from JSON or form-urlencoded request"""
    ct = (request.headers.get("content-type") or "").lower()
    
    if ct.startswith("application/x-www-form-urlencoded") or ct.startswith("multipart/form-data"):
        form = await request.form()
        # Convert form data to dict
        data = {}
        for key, value in form.items():
            data[key] = value
        return model_class(**data)
    else:
        # Default to JSON
        data = await request.json()
        return model_class(**data)

@router.post("/", response_model=Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_admin) # Only admins can create customers
):
    """
    Create a new customer.
    Accepts JSON or form-urlencoded data.
    """
    customer = await parse_request_data(request, CustomerCreate)
    customer_service = CustomerService(db)
    # The service/db layer will handle creation logic and potential IntegrityErrors
    return customer_service.create_customer(customer)

@router.get("/", response_model=List[Customer])
def read_customers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_admin) # Only admins can view all customers
):
    customer_service = CustomerService(db)
    customers = customer_service.get_customers(skip=skip, limit=limit)
    return customers

@router.get("/{customer_id}", response_model=Customer)
def read_customer(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    customer_service = CustomerService(db)
    customer = customer_service.get_customer(customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Only owner or admin can view this customer
    if str(customer.id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this customer")
    
    return customer

@router.put("/{customer_id}", response_model=Customer)
async def update_customer(
    customer_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Update a customer.
    Accepts JSON or form-urlencoded data.
    """
    customer = await parse_request_data(request, CustomerUpdate)
    customer_service = CustomerService(db)
    db_customer = customer_service.get_customer(customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Only owner or admin can update this customer
    if str(db_customer.id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this customer")
    
    updated_customer = customer_service.update_customer(customer_id, customer)
    return updated_customer

@router.delete("/{customer_id}", response_model=Customer)
def delete_customer(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_admin) # Only admins can delete customers
):
    customer_service = CustomerService(db)
    db_customer = customer_service.delete_customer(customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

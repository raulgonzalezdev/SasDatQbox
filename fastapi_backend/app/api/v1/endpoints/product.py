from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db, get_current_active_user, get_current_active_admin # Corrected import
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.services.product_service import ProductService
from app.services.business_service import BusinessService # Import BusinessService
from app.models.user import User as DBUser # Import DBUser for type hinting

router = APIRouter(
    tags=["Products"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    product_service = ProductService(db)
    business_service = BusinessService(db)

    # Check if the user owns the associated business
    business = business_service.get_business(product_in.business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to create product for this business")

    return product_service.create_product(product_in=product_in)

@router.get("/", response_model=List[Product])
def read_products(
    business_id: UUID,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    product_service = ProductService(db)
    products = product_service.get_products_by_business(business_id=business_id, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=Product)
def read_product(
    product_id: UUID,
    db: Session = Depends(get_db),
):
    product_service = ProductService(db)
    db_product = product_service.get_product(product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: UUID,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    product_service = ProductService(db)
    business_service = BusinessService(db)

    db_product = product_service.get_product(product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if the user owns the associated business
    business = business_service.get_business(db_product.business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Associated business not found")

    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this product")

    updated_product = product_service.update_product(product_id=product_id, product_in=product_in)
    return updated_product

@router.delete("/{product_id}", response_model=Product)
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_admin) # Only admins can delete products
):
    product_service = ProductService(db)
    business_service = BusinessService(db)

    db_product = product_service.get_product(product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if the user owns the associated business (even if admin, for logging/auditing)
    business = business_service.get_business(db_product.business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Associated business not found")

    deleted_product = product_service.delete_product(product_id=product_id)
    return deleted_product

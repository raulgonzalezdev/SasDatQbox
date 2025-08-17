from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.services.product_service import ProductService
from app.models.user import User # For dependency
from app.api.deps import get_current_user # For dependency

router = APIRouter(
    tags=["Products"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # TODO: Add authorization logic to check if current_user owns the business
    product_service = ProductService(db)
    return product_service.create_product(product_in=product_in)

@router.get("/", response_model=List[Product])
def read_products(
    business_id: UUID,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    # TODO: Add authorization logic to check if current_user can access this business
    product_service = ProductService(db)
    products = product_service.get_products_by_business(business_id=business_id, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=Product)
def read_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product_service = ProductService(db)
    db_product = product_service.get_product(product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    # TODO: Add authorization logic
    return db_product

@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: UUID,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product_service = ProductService(db)
    db_product = product_service.get_product(product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    # TODO: Add authorization logic
    updated_product = product_service.update_product(product_id=product_id, product_in=product_in)
    return updated_product

@router.delete("/{product_id}", response_model=Product)
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product_service = ProductService(db)
    db_product = product_service.get_product(product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    # TODO: Add authorization logic
    deleted_product = product_service.delete_product(product_id=product_id)
    return deleted_product

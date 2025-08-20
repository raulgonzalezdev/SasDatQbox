from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db, get_current_active_user
from app.schemas.subscription import (
    SubscriptionProduct, SubscriptionProductCreate,
    Price, PriceCreate,
    Subscription, SubscriptionCreate, SubscriptionUpdate,
    SubscriptionProductResponse, PriceResponse
)
from app.services.subscription_service import SubscriptionService
from app.models.user import User as DBUser

router = APIRouter()

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

# --- SubscriptionProduct Endpoints ---
@router.post("/products", response_model=SubscriptionProductResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription_product(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create a new subscription product.
    Accepts JSON or form-urlencoded data.
    """
    product_in = await parse_request_data(request, SubscriptionProductCreate)
    service = SubscriptionService(db)
    return service.create_subscription_product(product_in=product_in)

@router.get("/products", response_model=List[SubscriptionProductResponse])
def read_subscription_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: DBUser = Depends(get_current_active_user)
):
    service = SubscriptionService(db)
    return service.get_subscription_products(skip=skip, limit=limit)

# --- Price Endpoints ---
@router.post("/prices", response_model=PriceResponse, status_code=status.HTTP_201_CREATED)
async def create_price(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create a new price.
    Accepts JSON or form-urlencoded data.
    """
    price_in = await parse_request_data(request, PriceCreate)
    service = SubscriptionService(db)
    return service.create_price(price_in=price_in)

@router.get("/prices", response_model=List[PriceResponse])
def read_prices(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: DBUser = Depends(get_current_active_user)
):
    service = SubscriptionService(db)
    return service.get_prices(skip=skip, limit=limit)

# --- Subscription Endpoints ---
@router.post("/subscriptions", response_model=Subscription, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create a new subscription.
    Accepts JSON or form-urlencoded data.
    """
    subscription_in = await parse_request_data(request, SubscriptionCreate)
    service = SubscriptionService(db)
    return service.create_subscription(subscription_in=subscription_in)

@router.get("/subscriptions", response_model=List[Subscription])
def read_subscriptions(
    user_id: UUID,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: DBUser = Depends(get_current_active_user)
):
    service = SubscriptionService(db)
    return service.get_subscriptions_by_user(user_id=user_id, skip=skip, limit=limit)

@router.put("/subscriptions/{subscription_id}", response_model=Subscription)
async def update_subscription(
    subscription_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Update a subscription.
    Accepts JSON or form-urlencoded data.
    """
    subscription_in = await parse_request_data(request, SubscriptionUpdate)
    service = SubscriptionService(db)
    subscription = service.update_subscription(
        subscription_id=subscription_id, 
        subscription_in=subscription_in,
        user_id=current_user.id
    )
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found or you don't have permission to update it."
        )
    return subscription

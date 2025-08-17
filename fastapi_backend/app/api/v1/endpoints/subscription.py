from fastapi import APIRouter, Depends, HTTPException, status
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

# --- SubscriptionProduct Endpoints ---
@router.post("/products", response_model=SubscriptionProductResponse, status_code=status.HTTP_201_CREATED)
def create_subscription_product(
    product_in: SubscriptionProductCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
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
def create_price(
    price_in: PriceCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
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
def create_subscription(
    subscription_in: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
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
def update_subscription(
    subscription_id: UUID,
    subscription_in: SubscriptionUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
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

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.dependencies import get_db
from app.schemas.subscription import (
    SubscriptionProduct, SubscriptionProductCreate, SubscriptionProductUpdate,
    Price, PriceCreate, PriceUpdate,
    Subscription, SubscriptionCreate, SubscriptionUpdate
)
from app.services.subscription_service import SubscriptionService
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

# --- SubscriptionProduct Endpoints ---
@router.post("/products", response_model=SubscriptionProduct, status_code=status.HTTP_201_CREATED)
def create_subscription_product(
    product_in: SubscriptionProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SubscriptionService(db)
    return service.create_subscription_product(product_in=product_in)

@router.get("/products", response_model=List[SubscriptionProduct])
def read_subscription_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    service = SubscriptionService(db)
    return service.get_subscription_products(skip=skip, limit=limit)

# --- Price Endpoints ---
@router.post("/prices", response_model=Price, status_code=status.HTTP_201_CREATED)
def create_price(
    price_in: PriceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SubscriptionService(db)
    return service.create_price(price_in=price_in)

@router.get("/prices", response_model=List[Price])
def read_prices(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    service = SubscriptionService(db)
    return service.get_prices(skip=skip, limit=limit)

# --- Subscription Endpoints ---
@router.post("/subscriptions", response_model=Subscription, status_code=status.HTTP_201_CREATED)
def create_subscription(
    subscription_in: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SubscriptionService(db)
    return service.create_subscription(subscription_in=subscription_in)

@router.get("/subscriptions", response_model=List[Subscription])
def read_subscriptions(
    user_id: UUID,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    service = SubscriptionService(db)
    return service.get_subscriptions_by_user(user_id=user_id, skip=skip, limit=limit)

from typing import Optional, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
import enum

# --- Enums ---
class PricingType(str, enum.Enum):
    one_time = "one_time"
    recurring = "recurring"

class PricingPlanInterval(str, enum.Enum):
    day = "day"
    week = "week"
    month = "month"
    year = "year"

class SubscriptionStatus(str, enum.Enum):
    trialing = "trialing"
    active = "active"
    canceled = "canceled"
    incomplete = "incomplete"
    incomplete_expired = "incomplete_expired"
    past_due = "past_due"
    unpaid = "unpaid"
    paused = "paused"

# --- SubscriptionProduct Schemas ---
class SubscriptionProductBase(BaseModel):
    id: str
    active: Optional[bool] = None
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    metadata: Optional[dict] = None

class SubscriptionProductCreate(SubscriptionProductBase):
    pass

class SubscriptionProductUpdate(BaseModel):
    active: Optional[bool] = None
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    metadata: Optional[dict] = None

class SubscriptionProductInDB(SubscriptionProductBase):
    class Config:
        from_attributes = True

class SubscriptionProduct(SubscriptionProductInDB):
    pass

# --- Price Schemas ---
class PriceBase(BaseModel):
    id: str
    product_id: str
    active: Optional[bool] = None
    description: Optional[str] = None
    unit_amount: Optional[int] = None
    currency: Optional[str] = None
    type: Optional[PricingType] = None
    interval: Optional[PricingPlanInterval] = None
    interval_count: Optional[int] = None
    trial_period_days: Optional[int] = None
    metadata: Optional[dict] = None

class PriceCreate(PriceBase):
    pass

class PriceUpdate(BaseModel):
    active: Optional[bool] = None
    description: Optional[str] = None
    metadata: Optional[dict] = None

class PriceInDB(PriceBase):
    class Config:
        from_attributes = True

class Price(PriceInDB):
    pass

# --- Subscription Schemas ---
class SubscriptionBase(BaseModel):
    id: str
    user_id: UUID
    status: Optional[SubscriptionStatus] = None
    metadata: Optional[dict] = None
    price_id: Optional[str] = None
    quantity: Optional[int] = None
    cancel_at_period_end: Optional[bool] = None

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    status: Optional[SubscriptionStatus] = None
    metadata: Optional[dict] = None
    quantity: Optional[int] = None
    cancel_at_period_end: Optional[bool] = None

class SubscriptionInDB(SubscriptionBase):
    created: datetime
    current_period_start: datetime
    current_period_end: datetime
    ended_at: Optional[datetime] = None
    cancel_at: Optional[datetime] = None
    canceled_at: Optional[datetime] = None
    trial_start: Optional[datetime] = None
    trial_end: Optional[datetime] = None

    class Config:
        from_attributes = True

class Subscription(SubscriptionInDB):
    pass

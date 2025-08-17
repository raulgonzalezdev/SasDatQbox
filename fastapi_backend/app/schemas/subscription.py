from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

# Pydantic models for Subscription Status
class SubscriptionStatus:
    ACTIVE = "active"
    TRIALING = "trialing"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    UNPAID = "unpaid"
    INCOMPLETE = "incomplete"
    INCOMPLETE_EXPIRED = "incomplete_expired"
    ALL = "all"

# Pydantic models for Pricing Plan Interval
class PricingPlanInterval:
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    YEAR = "year"

# Pydantic models for Pricing Type
class PricingType:
    ONE_TIME = "one_time"
    RECURRING = "recurring"

# Base Pydantic models
class SubscriptionProductBase(BaseModel):
    id: str
    active: bool
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class PriceBase(BaseModel):
    id: str
    product_id: str
    active: bool
    unit_amount: Optional[int] = None
    currency: str
    type: str
    interval: Optional[str] = None
    interval_count: Optional[int] = None
    trial_period_days: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class SubscriptionBase(BaseModel):
    id: UUID
    user_id: UUID
    status: str
    metadata: Optional[Dict[str, Any]] = None
    price_id: Optional[str] = None
    quantity: Optional[int] = None
    cancel_at_period_end: bool
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

# Models with relationships
class SubscriptionProduct(SubscriptionProductBase):
    prices: List['Price'] = []

class Price(PriceBase):
    product: 'SubscriptionProduct'

class Subscription(SubscriptionBase):
    price: Optional['Price'] = None

# Create/Update models
class SubscriptionProductCreate(SubscriptionProductBase):
    pass

class PriceCreate(PriceBase):
    pass

class SubscriptionCreate(SubscriptionBase):

    pass

class SubscriptionUpdate(BaseModel):
    status: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    price_id: Optional[str] = None
    quantity: Optional[int] = None
    cancel_at_period_end: Optional[bool] = None

# To support circular references for relationships
SubscriptionProduct.model_rebuild()
Price.model_rebuild()
Subscription.model_rebuild()

import uuid
import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Boolean, BigInteger, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class SubscriptionProduct(Base):
    __tablename__ = "subscription_products"
    __table_args__ = {'schema': 'pos'}
    id = Column(String, primary_key=True) # Product ID from Stripe
    active = Column(Boolean)
    name = Column(String)
    description = Column(String)
    image = Column(String)
    metadata_ = Column("metadata", JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    prices = relationship("Price", back_populates="product")

class PricingType(enum.Enum):
    one_time = "one_time"
    recurring = "recurring"

class PricingPlanInterval(enum.Enum):
    day = "day"
    week = "week"
    month = "month"
    year = "year"

class Price(Base):
    __tablename__ = "prices"
    __table_args__ = {'schema': 'pos'}
    id = Column(String, primary_key=True) # Price ID from Stripe
    product_id = Column(String, ForeignKey('pos.subscription_products.id'))
    active = Column(Boolean)
    description = Column(String)
    unit_amount = Column(BigInteger)
    currency = Column(String(3))
    type = Column(Enum(PricingType))
    interval = Column(Enum(PricingPlanInterval))
    interval_count = Column(Integer)
    trial_period_days = Column(Integer)
    metadata_ = Column("metadata", JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    product = relationship("SubscriptionProduct", back_populates="prices")

class SubscriptionStatus(enum.Enum):
    trialing = "trialing"
    active = "active"
    canceled = "canceled"
    incomplete = "incomplete"
    incomplete_expired = "incomplete_expired"
    past_due = "past_due"
    unpaid = "unpaid"
    paused = "paused"

class Subscription(Base):
    __tablename__ = "subscriptions"
    __table_args__ = {'schema': 'pos'}
    id = Column(String, primary_key=True) # Subscription ID from Stripe
    user_id = Column(UUID(as_uuid=True), ForeignKey('pos.users.id'), nullable=False)
    status = Column(Enum(SubscriptionStatus))
    metadata_ = Column("metadata", JSON)
    price_id = Column(String, ForeignKey('pos.prices.id'))
    quantity = Column(Integer)
    cancel_at_period_end = Column(Boolean)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    current_period_start = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    current_period_end = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    cancel_at = Column(DateTime(timezone=True))
    canceled_at = Column(DateTime(timezone=True))
    trial_start = Column(DateTime(timezone=True))
    trial_end = Column(DateTime(timezone=True))
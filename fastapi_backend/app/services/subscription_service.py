from sqlalchemy.orm import Session
from app.models.subscription import SubscriptionProduct, Price, Subscription
from app.schemas.subscription import SubscriptionProductCreate, SubscriptionProductUpdate, PriceCreate, PriceUpdate, SubscriptionCreate, SubscriptionUpdate
from uuid import UUID

class SubscriptionService:
    def __init__(self, db: Session):
        self.db = db

    # --- SubscriptionProduct CRUD ---
    def get_subscription_product(self, product_id: str) -> SubscriptionProduct | None:
        return self.db.query(SubscriptionProduct).filter(SubscriptionProduct.id == product_id).first()

    def get_subscription_products(self, skip: int = 0, limit: int = 100) -> list[SubscriptionProduct]:
        return self.db.query(SubscriptionProduct).offset(skip).limit(limit).all()

    def create_subscription_product(self, product_in: SubscriptionProductCreate) -> SubscriptionProduct:
        db_product = SubscriptionProduct(**product_in.model_dump())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    # --- Price CRUD ---
    def get_price(self, price_id: str) -> Price | None:
        return self.db.query(Price).filter(Price.id == price_id).first()

    def get_prices(self, skip: int = 0, limit: int = 100) -> list[Price]:
        return self.db.query(Price).offset(skip).limit(limit).all()

    def create_price(self, price_in: PriceCreate) -> Price:
        db_price = Price(**price_in.model_dump())
        self.db.add(db_price)
        self.db.commit()
        self.db.refresh(db_price)
        return db_price

    # --- Subscription CRUD ---
    def get_subscription(self, subscription_id: str) -> Subscription | None:
        return self.db.query(Subscription).filter(Subscription.id == subscription_id).first()

    def get_subscriptions_by_user(self, user_id: UUID, skip: int = 0, limit: int = 100) -> list[Subscription]:
        return self.db.query(Subscription).filter(Subscription.user_id == user_id).offset(skip).limit(limit).all()

    def create_subscription(self, subscription_in: SubscriptionCreate) -> Subscription:
        db_subscription = Subscription(**subscription_in.model_dump())
        self.db.add(db_subscription)
        self.db.commit()
        self.db.refresh(db_subscription)
        return db_subscription

from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from uuid import UUID

class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def get_product(self, product_id: UUID) -> Product | None:
        return self.db.query(Product).filter(Product.id == product_id).first()

    def get_products_by_business(self, business_id: UUID, skip: int = 0, limit: int = 100) -> list[Product]:
        return self.db.query(Product).filter(Product.business_id == business_id).offset(skip).limit(limit).all()

    def create_product(self, product_in: ProductCreate) -> Product:
        db_product = Product(**product_in.model_dump())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    def update_product(self, product_id: UUID, product_in: ProductUpdate) -> Product | None:
        db_product = self.get_product(product_id)
        if not db_product:
            return None
        
        update_data = product_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    def delete_product(self, product_id: UUID) -> Product | None:
        db_product = self.get_product(product_id)
        if not db_product:
            return None
        self.db.delete(db_product)
        self.db.commit()
        return db_product

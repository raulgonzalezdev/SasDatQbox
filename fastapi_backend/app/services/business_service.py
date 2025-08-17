from sqlalchemy.orm import Session
from app.models.business import Business, BusinessLocation
from app.schemas.business import BusinessCreate, BusinessUpdate, BusinessLocationCreate, BusinessLocationUpdate
from uuid import UUID

class BusinessService:
    def __init__(self, db: Session):
        self.db = db

    # --- Business CRUD ---
    def get_business(self, business_id: UUID) -> Business | None:
        return self.db.query(Business).filter(Business.id == business_id).first()

    def get_businesses(self, owner_id: UUID | None = None, skip: int = 0, limit: int = 100) -> list[Business]:
        query = self.db.query(Business)
        if owner_id:
            query = query.filter(Business.owner_id == owner_id)
        return query.offset(skip).limit(limit).all()

    def create_business(self, business_in: BusinessCreate) -> Business:
        db_business = Business(
            name=business_in.name,
            address=business_in.address,
            phone=business_in.phone,
            email=business_in.email,
            tax_number=business_in.tax_number,
            owner_id=business_in.owner_id
        )
        self.db.add(db_business)
        self.db.commit()
        self.db.refresh(db_business)
        return db_business

    def update_business(self, business_id: UUID, business_in: BusinessUpdate) -> Business | None:
        db_business = self.get_business(business_id)
        if not db_business:
            return None
        
        update_data = business_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_business, key, value)
        
        self.db.add(db_business)
        self.db.commit()
        self.db.refresh(db_business)
        return db_business

    def delete_business(self, business_id: UUID) -> Business | None:
        db_business = self.get_business(business_id)
        if not db_business:
            return None
        self.db.delete(db_business)
        self.db.commit()
        return db_business

    # --- BusinessLocation CRUD ---
    def get_business_location(self, location_id: UUID) -> BusinessLocation | None:
        return self.db.query(BusinessLocation).filter(BusinessLocation.id == location_id).first()

    def get_business_locations_by_business(self, business_id: UUID, skip: int = 0, limit: int = 100) -> list[BusinessLocation]:
        return self.db.query(BusinessLocation).filter(BusinessLocation.business_id == business_id).offset(skip).limit(limit).all()

    def create_business_location(self, location_in: BusinessLocationCreate) -> BusinessLocation:
        db_location = BusinessLocation(
            business_id=location_in.business_id,
            name=location_in.name,
            address=location_in.address,
            phone=location_in.phone
        )
        self.db.add(db_location)
        self.db.commit()
        self.db.refresh(db_location)
        return db_location

    def update_business_location(self, location_id: UUID, location_in: BusinessLocationUpdate) -> BusinessLocation | None:
        db_location = self.get_business_location(location_id)
        if not db_location:
            return None
        
        update_data = location_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_location, key, value)
        
        self.db.add(db_location)
        self.db.commit()
        self.db.refresh(db_location)
        return db_location

    def delete_business_location(self, location_id: UUID) -> BusinessLocation | None:
        db_location = self.get_business_location(location_id)
        if not db_location:
            return None
        self.db.delete(db_location)
        self.db.commit()
        return db_location

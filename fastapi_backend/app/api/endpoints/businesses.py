from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.business import (
    Business, BusinessCreate, BusinessUpdate,
    BusinessLocation, BusinessLocationCreate, BusinessLocationUpdate
)
from app.services.business_service import BusinessService

router = APIRouter(
    prefix="/businesses",
    tags=["businesses"],
    responses={404: {"description": "Not found"}},
)

# --- Business Endpoints ---
@router.post("/", response_model=Business, status_code=status.HTTP_201_CREATED)
def create_business(business: BusinessCreate, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    return business_service.create_business(business)

@router.get("/", response_model=List[Business])
def read_businesses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    businesses = business_service.get_businesses(skip=skip, limit=limit)
    return businesses

@router.get("/{business_id}", response_model=Business)
def read_business(business_id: UUID, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    business = business_service.get_business(business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    return business

@router.put("/{business_id}", response_model=Business)
def update_business(business_id: UUID, business: BusinessUpdate, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    db_business = business_service.update_business(business_id, business)
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    return db_business

@router.delete("/{business_id}", response_model=Business)
def delete_business(business_id: UUID, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    db_business = business_service.delete_business(business_id)
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    return db_business

# --- BusinessLocation Endpoints ---
@router.post("/{business_id}/locations/", response_model=BusinessLocation, status_code=status.HTTP_201_CREATED)
def create_business_location(business_id: UUID, location: BusinessLocationCreate, db: Session = Depends(get_db)):
    if location.business_id != business_id:
        raise HTTPException(status_code=400, detail="Business ID in path and body do not match")
    business_service = BusinessService(db)
    return business_service.create_business_location(location)

@router.get("/{business_id}/locations/", response_model=List[BusinessLocation])
def read_business_locations(business_id: UUID, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    locations = business_service.get_business_locations_by_business(business_id, skip=skip, limit=limit)
    return locations

@router.get("/locations/{location_id}", response_model=BusinessLocation)
def read_business_location(location_id: UUID, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    location = business_service.get_business_location(location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Business location not found")
    return location

@router.put("/locations/{location_id}", response_model=BusinessLocation)
def update_business_location(location_id: UUID, location: BusinessLocationUpdate, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    db_location = business_service.update_business_location(location_id, location)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Business location not found")
    return db_location

@router.delete("/locations/{location_id}", response_model=BusinessLocation)
def delete_business_location(location_id: UUID, db: Session = Depends(get_db)):
    business_service = BusinessService(db)
    db_location = business_service.delete_business_location(location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Business location not found")
    return db_location

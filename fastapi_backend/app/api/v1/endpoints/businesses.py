from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_active_user
from app.schemas.business import (
    Business, BusinessCreate, BusinessUpdate,
    BusinessLocation, BusinessLocationCreate, BusinessLocationUpdate
)
from app.services.business_service import BusinessService
from app.models.user import User as DBUser # Import DBUser for type hinting
from app.api import deps
from app.api.deps import get_current_active_admin

router = APIRouter(
    tags=["Businesses"],
    responses={404: {"description": "Not found"}},
)

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

# --- Business Endpoints ---
@router.post("/", response_model=Business, status_code=status.HTTP_201_CREATED)
async def create_business(
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create a new business.
    Accepts JSON or form-urlencoded data.
    """
    business = await parse_request_data(request, BusinessCreate)
    business_service = BusinessService(db)
    # Set the owner_id to the current user's ID
    business.owner_id = current_user.id
    return business_service.create_business(business)

@router.get("/", response_model=List[Business])
def read_businesses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    business_service = BusinessService(db)
    owner_id_to_filter = None
    # If the user is not an admin, they can only see their own businesses.
    if current_user.role != "admin":
        owner_id_to_filter = current_user.id
    
    businesses = business_service.get_businesses(
        owner_id=owner_id_to_filter, skip=skip, limit=limit
    )
    return businesses

@router.get("/{business_id}", response_model=Business)
def read_business(
    business_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    business_service = BusinessService(db)
    business = business_service.get_business(business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Only owner or admin can view this business
    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this business")
    
    return business

@router.put("/{business_id}", response_model=Business)
async def update_business(
    business_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Update a business.
    Accepts JSON or form-urlencoded data.
    """
    business = await parse_request_data(request, BusinessUpdate)
    business_service = BusinessService(db)
    db_business = business_service.get_business(business_id)
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Only owner or admin can update this business
    if str(db_business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this business")
    
    updated_business = business_service.update_business(business_id, business)
    return updated_business

@router.delete("/{business_id}", response_model=Business)
def delete_business(
    *,
    db: Session = Depends(deps.get_db),
    business_id: str,
    current_user: DBUser = Depends(get_current_active_admin) # Only admins can delete businesses
):
    business_service = BusinessService(db)
    db_business = business_service.get_business(business_id)
    if db_business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Additional check: ensure admin is not deleting a business they own if that's a policy
    # For now, admin can delete any business.
    
    deleted_business = business_service.delete_business(business_id)
    return deleted_business

# --- BusinessLocation Endpoints ---
@router.post("/{business_id}/locations/", response_model=BusinessLocation, status_code=status.HTTP_201_CREATED)
async def create_business_location(
    business_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Create a new business location.
    Accepts JSON or form-urlencoded data.
    """
    location = await parse_request_data(request, BusinessLocationCreate)
    business_service = BusinessService(db)
    business = business_service.get_business(business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Only owner of the business or admin can create a location for it
    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to create location for this business")

    if location.business_id != business_id:
        raise HTTPException(status_code=400, detail="Business ID in path and body do not match")
    
    return business_service.create_business_location(location)

@router.get("/{business_id}/locations/", response_model=List[BusinessLocation])
def read_business_locations(
    business_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    business_service = BusinessService(db)
    business = business_service.get_business(business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Only owner of the business or admin can view its locations
    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view locations for this business")

    locations = business_service.get_business_locations_by_business(business_id, skip=skip, limit=limit)
    return locations

@router.get("/locations/{location_id}", response_model=BusinessLocation)
def read_business_location(
    location_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    business_service = BusinessService(db)
    location = business_service.get_business_location(location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Business location not found")
    
    business = business_service.get_business(location.business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Associated business not found")

    # Only owner of the associated business or admin can view this location
    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this business location")

    return location

@router.put("/locations/{location_id}", response_model=BusinessLocation)
async def update_business_location(
    location_id: UUID,
    request: Request,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_user)
):
    """
    Update a business location.
    Accepts JSON or form-urlencoded data.
    """
    location = await parse_request_data(request, BusinessLocationUpdate)
    business_service = BusinessService(db)
    db_location = business_service.get_business_location(location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Business location not found")
    
    business = business_service.get_business(db_location.business_id)
    if business is None:
        raise HTTPException(status_code=404, detail="Associated business not found")

    # Only owner of the associated business or admin can update this location
    if str(business.owner_id) != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this business location")

    updated_location = business_service.update_business_location(location_id, location)
    return updated_location

@router.delete("/locations/{location_id}", response_model=BusinessLocation)
def delete_business_location(
    location_id: UUID,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_active_admin) # Only admins can delete locations
):
    business_service = BusinessService(db)
    db_location = business_service.get_business_location(location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Business location not found")
    
    # Admin can delete any location. No need to check ownership here.
    
    deleted_location = business_service.delete_business_location(location_id)
    return deleted_location

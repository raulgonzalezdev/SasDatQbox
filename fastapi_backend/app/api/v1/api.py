from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, users, businesses, customers, product, inventory, 
    stock_transfer, subscription, appointments, patients, chat
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(businesses.router, prefix="/businesses", tags=["Businesses"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(product.router, prefix="/products", tags=["Products"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
api_router.include_router(stock_transfer.router, prefix="/stock-transfers", tags=["Stock Transfers"])
api_router.include_router(subscription.router, prefix="/subscriptions", tags=["Subscriptions"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["Appointments"])
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])

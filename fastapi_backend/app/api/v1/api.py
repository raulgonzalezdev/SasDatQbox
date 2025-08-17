from fastapi import APIRouter

from .endpoints import (
    auth, users, businesses, customers, product, inventory,
    stock_transfer, subscription, patients, appointments, chat, dashboard
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users")
api_router.include_router(businesses.router, prefix="/businesses")
api_router.include_router(subscription.router, prefix="/subscriptions")
api_router.include_router(product.router, prefix="/products")
api_router.include_router(inventory.router, prefix="/inventory")
api_router.include_router(customers.router, prefix="/customers")
api_router.include_router(patients.router, prefix="/patients")
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

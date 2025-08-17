from fastapi import FastAPI
from app.api.v1.endpoints import auth, users, businesses, customers, product, inventory, stock_transfer, subscription, appointments, patients, chat

app = FastAPI(
    title="SasDatQbox API",
    description="API para el sistema SasDatQbox, incluyendo autenticación, gestión de negocios y suscripciones.",
    version="1.0.0"
)

# API v1 Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(businesses.router, prefix="/api/v1/businesses", tags=["Businesses"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["Customers"])
app.include_router(product.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(inventory.router, prefix="/api/v1/inventory", tags=["Inventory"])
app.include_router(stock_transfer.router, prefix="/api/v1", tags=["Stock Transfers"])
app.include_router(subscription.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"])
app.include_router(appointments.router, prefix="/api/v1", tags=["Appointments"])
app.include_router(patients.router, prefix="/api/v1", tags=["Patients"])
app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenido a la API de SasDatQbox v1"}
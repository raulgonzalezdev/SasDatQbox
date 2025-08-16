from fastapi import FastAPI
from app.api.v1.endpoints import auth
from app.api.endpoints import users # Import the new users router
from app.api.endpoints import businesses # Import the new businesses router
from app.api.endpoints import customers # Import the new customers router

app = FastAPI(
    title="SasDatQbox API",
    description="API para el sistema SasDatQbox, incluyendo autenticación, gestión de negocios y suscripciones.",
    version="0.1.0"
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(businesses.router, prefix="/api/v1", tags=["Businesses"])
app.include_router(customers.router, prefix="/api/v1", tags=["Customers"]) # Include the customers router

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenido a la API de SasDatQbox"}
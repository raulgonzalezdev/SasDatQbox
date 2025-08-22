from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

print(f"CORS Origins: {settings.BACKEND_CORS_ORIGINS}")

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8081"], # Añadimos localhost para desarrollo
    allow_origin_regex=r"https://.*\.datqbox\.online", # Mantenemos la regex para producción
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    # Log the error for debugging
    print(f"IntegrityError: {exc.orig}")
    return JSONResponse(
        status_code=409,  # Conflict
        content={"detail": "Database integrity error. A resource may already exist."},
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenido a la API de SasDatQbox v1"}
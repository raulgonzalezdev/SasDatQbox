from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.schemas.user import UserCreate, User as UserResponse, UserUpdate
from app.schemas.auth import AuthOut
from app.services.user_service import UserService
from app.core.security import verify_password, ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.auth import create_access_token

router = APIRouter(tags=["Auth"], responses={401: {"description": "Unauthorized"}})

@router.post("/register", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
def register_user(*, db: Session = Depends(get_db), user_in: UserCreate):
    svc = UserService(db)
    if svc.get_by_email(db, email=user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    user = svc.create(db, obj_in=user_in)

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"token": access_token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=AuthOut)
async def login_for_access_token(
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
):
    # Acepta JSON {email|username,password} o form-urlencoded username/password
    ct = (request.headers.get("content-type") or "").lower()
    username: Optional[str] = None
    password: Optional[str] = None

    if ct.startswith("application/x-www-form-urlencoded") or ct.startswith("multipart/form-data"):
        form = await request.form()
        username = (form.get("username") or form.get("email") or "").strip()
        password = (form.get("password") or "").strip()
    else:
        data = await request.json()
        username = (data.get("username") or data.get("email") or "").strip()
        password = (data.get("password") or "").strip()

    if not username or not password:
        raise HTTPException(status_code=422, detail="username/email y password son requeridos")

    svc = UserService(db)
    user = svc.get_by_email(db, email=username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    # Cookie útil para front web (no afecta a móvil)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=True,
        samesite="none",   # subdominios tras Cloudflare
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return {"token": access_token, "token_type": "bearer", "user": user}

@router.post("/refresh", response_model=AuthOut)
async def refresh_token(current_user: UserResponse = Depends(get_current_user)):
    # Reemite un token (si el actual sigue siendo válido)
    token = create_access_token(
        data={"sub": str(current_user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"token": token, "token_type": "bearer", "user": current_user}

@router.get("/me", response_model=dict)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    # Tu app maneja `data.user || user`, devolvemos { user }
    return {"user": current_user}

@router.put("/profile", response_model=dict)
async def update_profile(
    user_update: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar perfil del usuario autenticado"""
    svc = UserService(db)
    updated_user = svc.update(db, db_obj=current_user, obj_in=user_update)
    return {"user": updated_user}

@router.post("/logout")
async def logout(response: Response):
    """Cerrar sesión - elimina la cookie"""
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logout successful"}
import os
import uuid
import pytest
import requests
from sqlalchemy import create_engine, text
from app.core.config import settings
from app.db.base import Base

# ------------------ Config ------------------
BASE_URL = os.getenv("TEST_BASE_URL", "http://localhost:8001/api/v1")
USER_PASSWORD = os.getenv("TEST_ADMIN_PASSWORD", "testpassword")

# Tablas a truncar al inicio (orden da igual por CASCADE)
TABLES_TO_TRUNCATE = [
    "appointment_documents",
    "appointments",
    "business_locations",
    "businesses",
    "conversation_participants",
    "conversations",
    "customers",
    "inventory",
    "messages",
    "patients",
    "prices",
    "products",
    "stock_transfer_items",
    "stock_transfers",
    "subscription_products",
    "subscriptions",
    "users",
]

# ------------------ HTTP session ------------------
@pytest.fixture(scope="session")
def http():
    s = requests.Session()
    yield s
    s.close()

# ------------------ Engine DB ------------------
@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(settings.DATABASE_URL, future=True)
    Base.metadata.create_all(bind=engine)  # por si algo falta en local
    yield engine
    engine.dispose()

# ------------------ Reset SOLO al inicio ------------------
@pytest.fixture(scope="session", autouse=True)
def reset_db_once(db_engine):
    with db_engine.connect() as conn:
        with conn.begin():
            conn.execute(
                text(
                    "TRUNCATE TABLE "
                    + ", ".join([f'pos."{t}"' for t in TABLES_TO_TRUNCATE])
                    + " RESTART IDENTITY CASCADE;"
                )
            )
    # A partir de aquí NO se borra más durante el run
    yield

# ------------------ Admin de sesión + token ------------------
@pytest.fixture(scope="session")
def admin_ctx(http, db_engine):
    admin_email = f"admin_{uuid.uuid4()}@example.com"

    # 1) Registrar (si el endpoint ignora role/is_superuser, lo corregimos en DB)
    r = http.post(
        f"{BASE_URL}/auth/register",
        json={
            "email": admin_email,
            "password": USER_PASSWORD,
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin",
            "is_superuser": True,
            "is_active": True,
        },
    )
    assert r.status_code in (200, 201), f"register failed: {r.status_code} {r.text}"
    admin_user = r.json()

    # 2) Promover directamente en DB para asegurar que es superuser y rol correcto
    with db_engine.begin() as conn:
        conn.execute(
            text(
                """
                UPDATE pos.users
                   SET is_superuser = TRUE,
                       is_active    = TRUE,
                       role         = 'ADMIN'
                 WHERE email = :email
                """
            ),
            {"email": admin_email},
        )

    # 3) Login -> token
    r = http.post(f"{BASE_URL}/auth/login", data={"username": admin_email, "password": USER_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    token = r.json().get("access_token")
    assert token, "No se recibió access_token"
    headers = {"Authorization": f"Bearer {token}"}

    # 4) Sanity check
    r = http.get(f"{BASE_URL}/auth/me", headers=headers)
    assert r.status_code == 200, f"/auth/me 401: {r.text}"

    return {"user": admin_user, "email": admin_email, "headers": headers, "token": token}

# ------------------ Atajos para tests ------------------
@pytest.fixture(scope="function")
def auth_headers(admin_ctx):
    return admin_ctx["headers"]

@pytest.fixture(scope="function")
def admin_user(admin_ctx):
    return admin_ctx["user"]

@pytest.fixture(scope="session")
def base_url():
    return BASE_URL

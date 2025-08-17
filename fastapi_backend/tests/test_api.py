import pytest
import requests
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# --- Configuration ---
BASE_URL = "http://localhost:8001/api/v1"
USER_EMAIL = "testuser@example.com"
USER_PASSWORD = "testpassword"

# --- Database Fixture ---
@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(settings.DATABASE_URL)
    yield engine
    engine.dispose()

@pytest.fixture(scope="function", autouse=True)
def setup_database(db_engine):
    with db_engine.connect() as connection:
        connection.execute(text("DROP SCHEMA IF EXISTS pos CASCADE;"))
        connection.execute(text("CREATE SCHEMA pos;"))
        # Here you should apply migrations
        # For now, we'll rely on the app to create tables or assume they exist
    yield

# --- Auth Fixtures ---
@pytest.fixture(scope="module")
def registered_user():
    """Register a new user and return their data."""
    url = f"{BASE_URL}/auth/register"
    user_data = {
        "email": USER_EMAIL,
        "password": USER_PASSWORD,
        "first_name": "Test",
        "last_name": "User",
    }
    response = requests.post(url, json=user_data)
    assert response.status_code == 201
    return response.json()

@pytest.fixture(scope="module")
def auth_token(registered_user):
    """Log in the registered user and return the auth token."""
    url = f"{BASE_URL}/auth/login"
    login_data = {"username": registered_user["email"], "password": USER_PASSWORD}
    response = requests.post(url, data=login_data)
    assert response.status_code == 200
    return response.json()["access_token"]

# --- API Tests ---
def test_get_current_user(auth_token):
    """Test retrieving the current user."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["email"] == USER_EMAIL

def test_create_business(auth_token, registered_user):
    """Test creating a new business."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    business_data = {
        "name": "Test Business",
        "owner_id": registered_user["id"]
    }
    response = requests.post(f"{BASE_URL}/businesses/", headers=headers, json=business_data)
    assert response.status_code == 201
    assert response.json()["name"] == "Test Business"

import pytest
import requests
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from alembic.config import Config
from alembic import command
from app.db.base import Base  # Import the Base for metadata
from app.models import user, business, product, customer, inventory, subscription, patient, appointment, conversation
import uuid

# --- Configuration ---
BASE_URL = "http://localhost:8001/api/v1"
USER_EMAIL = "testuser@example.com"
USER_PASSWORD = "testpassword"

# --- Database Fixture ---
@pytest.fixture(scope="session")
def db_engine():
    engine = create_engine(settings.DATABASE_URL)
    # The first time tests run, create all tables
    Base.metadata.create_all(bind=engine)
    yield engine
    engine.dispose()

@pytest.fixture(scope="function", autouse=True)
def setup_database(db_engine):
    """
    This fixture cleans all data from tables before each test by truncating them.
    """
    tables = Base.metadata.sorted_tables
    
    with db_engine.connect() as connection:
        with connection.begin():
            for table in reversed(tables):
                # We use the 'pos' schema explicitly.
                connection.execute(text(f'TRUNCATE TABLE pos."{table.name}" RESTART IDENTITY CASCADE;'))
    yield

# --- Auth Fixtures ---
@pytest.fixture(scope="function")
def registered_user(setup_database):
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

@pytest.fixture(scope="function")
def auth_token(registered_user):
    """Log in the registered user and return the auth token."""
    url = f"{BASE_URL}/auth/login"
    login_data = {"username": registered_user["email"], "password": USER_PASSWORD}
    response = requests.post(url, data=login_data)
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest.fixture(scope="function")
def admin_user_token():
    """
    Register an admin user and return their auth token.
    This creates a separate user from the default patient user.
    """
    # Register Admin User
    url = f"{BASE_URL}/auth/register"
    admin_email = f"admin_{uuid.uuid4()}@example.com"
    user_data = {
        "email": admin_email,
        "password": USER_PASSWORD,
        "first_name": "Admin",
        "last_name": "User",
        "role": "ADMIN"
    }
    response = requests.post(url, json=user_data)
    assert response.status_code == 201
    admin_user = response.json()

    # Login Admin User
    login_url = f"{BASE_URL}/auth/login"
    login_data = {"username": admin_email, "password": USER_PASSWORD}
    response = requests.post(login_url, data=login_data)
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture(scope="function")
def test_business(auth_token, registered_user):
    """Create a business for testing purposes."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    business_data = {
        "name": "Test Business for GET",
        "owner_id": registered_user["id"]
    }
    response = requests.post(f"{BASE_URL}/businesses/", headers=headers, json=business_data)
    assert response.status_code == 201
    return response.json()

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

def test_get_business(auth_token, test_business):
    """Test retrieving a single business."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    business_id = test_business["id"]
    response = requests.get(f"{BASE_URL}/businesses/{business_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Test Business for GET"

def test_get_businesses(auth_token):
    """Test retrieving all businesses."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/businesses/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_business(auth_token, test_business):
    """Test updating a business."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    business_id = test_business["id"]
    update_data = {"name": "Updated Test Business"}
    response = requests.put(f"{BASE_URL}/businesses/{business_id}", headers=headers, json=update_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Test Business"

def test_delete_business(auth_token, test_business):
    """Test deleting a business."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    business_id = test_business["id"]
    response = requests.delete(f"{BASE_URL}/businesses/{business_id}", headers=headers)
    assert response.status_code == 200
    # Verify it's gone
    response = requests.get(f"{BASE_URL}/businesses/{business_id}", headers=headers)
    assert response.status_code == 404

# --- Business Location Fixtures and Tests ---
@pytest.fixture(scope="function")
def test_business_location(auth_token, test_business):
    """Create a business location for testing purposes."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    business_id = test_business["id"]
    location_data = {
        "name": "Main Warehouse",
        "address": "123 Test St",
        "business_id": business_id
    }
    response = requests.post(f"{BASE_URL}/businesses/{business_id}/locations/", headers=headers, json=location_data)
    assert response.status_code == 201
        return response.json()

def test_create_business_location(auth_token, test_business):
    """Test creating a new business location."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    business_id = test_business["id"]
    location_data = {
        "name": "Downtown Store",
        "address": "456 Main St",
        "business_id": business_id
    }
    response = requests.post(f"{BASE_URL}/businesses/{business_id}/locations/", headers=headers, json=location_data)
    assert response.status_code == 201
    assert response.json()["name"] == "Downtown Store"

def test_get_business_location(auth_token, test_business_location):
    """Test retrieving a single business location."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    location_id = test_business_location["id"]
    response = requests.get(f"{BASE_URL}/businesses/locations/{location_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Main Warehouse"

def test_get_business_locations(auth_token, test_business):
    """Test retrieving all locations for a business."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    business_id = test_business["id"]
    response = requests.get(f"{BASE_URL}/businesses/{business_id}/locations/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_business_location(auth_token, test_business_location):
    """Test updating a business location."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    location_id = test_business_location["id"]
    update_data = {"address": "123 Updated Ave"}
    response = requests.put(f"{BASE_URL}/businesses/locations/{location_id}", headers=headers, json=update_data)
    assert response.status_code == 200
    assert response.json()["address"] == "123 Updated Ave"

def test_delete_business_location(auth_token, test_business_location):
    """Test deleting a business location."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    location_id = test_business_location["id"]
    response = requests.delete(f"{BASE_URL}/businesses/locations/{location_id}", headers=headers)
    assert response.status_code == 200
    # Verify it's gone
    response = requests.get(f"{BASE_URL}/businesses/locations/{location_id}", headers=headers)
    assert response.status_code == 404

# --- Product Fixtures and Tests ---
@pytest.fixture(scope="function")
def test_product(auth_token, test_business):
    """Create a product for testing purposes."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    product_data = {
        "name": "Test Product",
        "description": "A product for testing.",
        "business_id": test_business["id"],
        "price": 10.99,
        "sku": "TEST-SKU-001"
    }
    response = requests.post(f"{BASE_URL}/products/", headers=headers, json=product_data)
    assert response.status_code == 201
        return response.json()

def test_create_product(auth_token, test_business):
    """Test creating a new product."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    product_data = {
        "name": "Another Test Product",
        "description": "Another product for testing.",
        "business_id": test_business["id"],
        "price": 15.00,
        "sku": "TEST-SKU-002"
    }
    response = requests.post(f"{BASE_URL}/products/", headers=headers, json=product_data)
    assert response.status_code == 201
    assert response.json()["name"] == "Another Test Product"

def test_get_product(auth_token, test_product):
    """Test retrieving a single product."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    product_id = test_product["id"]
    response = requests.get(f"{BASE_URL}/products/{product_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Test Product"

def test_get_products(auth_token):
    """Test retrieving all products."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/products/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_product(auth_token, test_product):
    """Test updating a product."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    product_id = test_product["id"]
    update_data = {"price": 12.50}
    response = requests.put(f"{BASE_URL}/products/{product_id}", headers=headers, json=update_data)
    assert response.status_code == 200
    assert response.json()["price"] == 12.50

def test_delete_product(admin_user_token, test_product):
    """Test deleting a product (requires admin)."""
    headers = {"Authorization": f"Bearer {admin_user_token}"}
    product_id = test_product["id"]
    response = requests.delete(f"{BASE_URL}/products/{product_id}", headers=headers)
    assert response.status_code == 200
    # Verify it's gone
    response = requests.get(f"{BASE_URL}/products/{product_id}", headers=headers)
    assert response.status_code == 404

# --- Customer Fixtures and Tests ---
@pytest.fixture(scope="function")
def test_customer(auth_token, test_business):
    """Create a customer for testing purposes."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    customer_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890",
        "business_id": test_business["id"]
    }
    response = requests.post(f"{BASE_URL}/customers/", headers=headers, json=customer_data)
    assert response.status_code == 201
    return response.json()

def test_create_customer(admin_user_token, test_business):
    """Test creating a new customer (requires admin)."""
    headers = {"Authorization": f"Bearer {admin_user_token}"}
    customer_data = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@example.com",
        "business_id": test_business["id"]
    }
    response = requests.post(f"{BASE_URL}/customers/", headers=headers, json=customer_data)
    assert response.status_code == 201
    assert response.json()["first_name"] == "Jane"

def test_get_customer(auth_token, test_customer):
    """Test retrieving a single customer."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    customer_id = test_customer["id"]
    response = requests.get(f"{BASE_URL}/customers/{customer_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "john.doe@example.com"

def test_get_customers(auth_token):
    """Test retrieving all customers."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/customers/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_customer(auth_token, test_customer):
    """Test updating a customer."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    customer_id = test_customer["id"]
    update_data = {"phone": "0987654321"}
    response = requests.put(f"{BASE_URL}/customers/{customer_id}", headers=headers, json=update_data)
    assert response.status_code == 200
    assert response.json()["phone"] == "0987654321"

def test_delete_customer(admin_user_token, test_customer):
    """Test deleting a customer (requires admin)."""
    headers = {"Authorization": f"Bearer {admin_user_token}"}
    customer_id = test_customer["id"]
    response = requests.delete(f"{BASE_URL}/customers/{customer_id}", headers=headers)
    assert response.status_code == 200
    # Verify it's gone
    response = requests.get(f"{BASE_URL}/customers/{customer_id}", headers=headers)
    assert response.status_code == 404

# --- Inventory Fixtures and Tests ---
@pytest.fixture(scope="function")
def test_inventory_item(auth_token, test_business, test_product, test_business_location):
    """Create an inventory item for testing purposes."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    inventory_data = {
        "product_id": test_product["id"],
        "business_id": test_business["id"],
        "quantity": 100,
        "location_id": test_business_location["id"]
    }
    response = requests.post(f"{BASE_URL}/inventory/", headers=headers, json=inventory_data)
    assert response.status_code == 201
    return response.json()

def test_create_inventory_item(auth_token, test_business, test_product, test_business_location):
    """Test creating a new inventory item."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    inventory_data = {
        "product_id": test_product["id"],
        "business_id": test_business["id"],
        "quantity": 50,
        "location_id": test_business_location["id"]
    }
    # This might create a duplicate if the product/location combo is unique.
    # Let's assume for now the service handles updates if it exists, or test GET first.
    # A better approach would be to use a different product or location for creation test.
    # For now, we'll check for 201 (created) or 200 (ok/updated).
    response = requests.post(f"{BASE_URL}/inventory/", headers=headers, json=inventory_data)
    assert response.status_code in [200, 201]
    assert response.json()["quantity"] == 50

def test_get_inventory_item(auth_token, test_inventory_item):
    """Test retrieving a single inventory item."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    item_id = test_inventory_item["id"]
    response = requests.get(f"{BASE_URL}/inventory/{item_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["quantity"] == 100

def test_get_inventory_items(auth_token):
    """Test retrieving all inventory items."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/inventory/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_inventory_item(auth_token, test_inventory_item):
    """Test updating an inventory item."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    item_id = test_inventory_item["id"]
    update_data = {"quantity": 150}
    response = requests.put(f"{BASE_URL}/inventory/{item_id}", headers=headers, json=update_data)
    assert response.status_code == 200
    assert response.json()["quantity"] == 150

def test_delete_inventory_item(auth_token, test_inventory_item):
    """Test deleting an inventory item."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    item_id = test_inventory_item["id"]
    response = requests.delete(f"{BASE_URL}/inventory/{item_id}", headers=headers)
    assert response.status_code == 200
    # Verify it's gone
    response = requests.get(f"{BASE_URL}/inventory/{item_id}", headers=headers)
    assert response.status_code == 404

# --- Subscription Fixtures and Tests ---
@pytest.fixture(scope="function")
def test_subscription_product(auth_token):
    """Create a subscription product for testing."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    product_data = {
        "id": "prod_test_plan",
        "active": True,
        "name": "Test Plan"
    }
    response = requests.post(f"{BASE_URL}/subscriptions/products", headers=headers, json=product_data)
    assert response.status_code == 201
    return response.json()

@pytest.fixture(scope="function")
def test_price(auth_token, test_subscription_product):
    """Create a price for the subscription product."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    price_data = {
        "id": "price_test_monthly",
        "product_id": test_subscription_product["id"],
        "active": True,
        "unit_amount": 1000,
        "currency": "usd",
        "type": "recurring",
        "interval": "month"
    }
    response = requests.post(f"{BASE_URL}/subscriptions/prices", headers=headers, json=price_data)
    assert response.status_code == 201
    return response.json()

def test_get_subscription_products(auth_token):
    """Test retrieving subscription products."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/subscriptions/products", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_prices(auth_token):
    """Test retrieving prices."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/subscriptions/prices", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Note: Creating/managing actual subscriptions would require a user context 
# and potentially mocking Stripe or a payment provider.
# For now, we test the product and price endpoints.

# --- Patient Fixtures and Tests ---
@pytest.fixture(scope="function")
def test_patient(auth_token):
    """Create a patient for testing purposes."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    patient_data = {
        "first_name": "Test",
        "last_name": "Patient",
        "date_of_birth": "1990-01-01",
        "contact_info": {
            "email": "patient@example.com",
            "phone": "555-1234"
        }
    }
    response = requests.post(f"{BASE_URL}/patients/", headers=headers, json=patient_data)
    assert response.status_code == 201
    return response.json()

def test_create_patient(auth_token):
    """Test creating a new patient."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    patient_data = {
        "first_name": "Another",
        "last_name": "Patient",
        "date_of_birth": "1985-05-10",
        "contact_info": {
            "email": "another.patient@example.com"
        }
    }
    response = requests.post(f"{BASE_URL}/patients/", headers=headers, json=patient_data)
    assert response.status_code == 201
    assert response.json()["last_name"] == "Patient"

def test_get_patient(auth_token, test_patient):
    """Test retrieving a single patient."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    patient_id = test_patient["id"]
    response = requests.get(f"{BASE_URL}/patients/{patient_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["first_name"] == "Test"

def test_get_patients(auth_token):
    """Test retrieving all patients."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/patients/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_patient(auth_token, test_patient):
    """Test updating a patient."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    patient_id = test_patient["id"]
    update_data = {"contact_info": {"phone": "555-5678"}}
    response = requests.put(f"{BASE_URL}/patients/{patient_id}", headers=headers, json=update_data)
    assert response.status_code == 200
    assert response.json()["contact_info"]["phone"] == "555-5678"

def test_delete_patient(auth_token, test_patient):
    """Test deleting a patient."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    patient_id = test_patient["id"]
    response = requests.delete(f"{BASE_URL}/patients/{patient_id}", headers=headers)
    assert response.status_code == 200
    # Verify it's gone
    response = requests.get(f"{BASE_URL}/patients/{patient_id}", headers=headers)
    assert response.status_code == 404

# --- Appointment Fixtures and Tests ---
@pytest.fixture(scope="function")
def test_appointment(auth_token, registered_user, test_patient):
    """Create an appointment for testing purposes."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    appointment_data = {
        "doctor_id": registered_user["id"],
        "patient_id": test_patient["id"],
        "appointment_time": "2024-10-26T10:00:00Z",
        "status": "SCHEDULED"
    }
    response = requests.post(f"{BASE_URL}/appointments/", headers=headers, json=appointment_data)
    assert response.status_code == 201
    return response.json()

def test_create_appointment(auth_token, registered_user, test_patient):
    """Test creating a new appointment."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    appointment_data = {
        "doctor_id": registered_user["id"],
        "patient_id": test_patient["id"],
        "appointment_time": "2024-10-27T11:00:00Z",
        "status": "SCHEDULED"
    }
    response = requests.post(f"{BASE_URL}/appointments/", headers=headers, json=appointment_data)
    assert response.status_code == 201
    assert response.json()["status"] == "SCHEDULED"

def test_get_appointment(auth_token, test_appointment):
    """Test retrieving a single appointment."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    appointment_id = test_appointment["id"]
    response = requests.get(f"{BASE_URL}/appointments/{appointment_id}", headers=headers)
    assert response.status_code == 200

def test_update_appointment(auth_token, test_appointment):
    """Test updating an appointment."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    appointment_id = test_appointment["id"]
    update_data = {"status": "COMPLETED"}
    response = requests.put(f"{BASE_URL}/appointments/{appointment_id}", headers=headers, json=update_data)
    assert response.status_code == 200
    assert response.json()["status"] == "COMPLETED"

# --- Chat Fixtures and Tests ---
@pytest.fixture(scope="function")
def test_conversation(auth_token, test_appointment):
    """Create a conversation for testing purposes."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    conversation_data = {
        "appointment_id": test_appointment["id"],
        "type": "MEDICAL_CONSULTATION"
    }
    response = requests.post(f"{BASE_URL}/chat/conversations/", headers=headers, json=conversation_data)
    assert response.status_code == 201
    return response.json()

def test_get_user_conversations(auth_token):
    """Test retrieving user's conversations."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = requests.get(f"{BASE_URL}/chat/conversations/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_send_message(auth_token, registered_user, test_conversation):
    """Test sending a message in a conversation."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    message_data = {
        "conversation_id": test_conversation["id"],
        "sender_id": registered_user["id"],
        "content": "Hello, this is a test message."
    }
    response = requests.post(f"{BASE_URL}/chat/messages/", headers=headers, json=message_data)
    assert response.status_code == 201
    assert response.json()["content"] == "Hello, this is a test message."

def test_get_messages(auth_token, test_conversation):
    """Test retrieving messages from a conversation."""
    headers = {"Authorization": f"Bearer {auth_token}"}
    conversation_id = test_conversation["id"]
    response = requests.get(f"{BASE_URL}/chat/conversations/{conversation_id}/messages/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    # After sending one message, we expect the list to contain at least one message.
    assert len(response.json()) > 0

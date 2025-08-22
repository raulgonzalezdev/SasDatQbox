import uuid
import json
from datetime import datetime, timedelta

# ================== Auth Helpers ==================
def register_user(http, base_url, role="patient", password="testpassword"):
    email = _uniq_email(role)
    payload = {
        "email": email,
        "password": password,
        "first_name": "Test",
        "last_name": "User",
        "role": role,
    }
    r = http.post(f"{base_url}/auth/register", json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def login_user(http, base_url, email, password="testpassword"):
    r = http.post(f"{base_url}/auth/login", data={"username": email, "password": password})
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# ================== Sanity ==================
def test_me(http, auth_headers, admin_user, base_url):
    r = http.get(f"{base_url}/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == admin_user["email"]

# ================== Businesses ==================
def _uniq_name(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}"

def _uniq_email(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}@example.com"

def _uniq_sku(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}"

# --- fixtures inline estilo simple (depende de admin) ---
def create_business(http, headers, base_url, owner_id, name=None):
    payload = {
        "name": name or _uniq_name("Biz"),
        "owner_id": owner_id,
    }
    r = http.post(f"{base_url}/businesses/", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def test_create_business(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"], name="Test Business")
    assert b["name"] == "Test Business"

def test_get_business(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"], name="Test Business for GET")
    r = http.get(f"{base_url}/businesses/{b['id']}", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["name"] == "Test Business for GET"

def test_get_businesses(http, auth_headers, base_url):
    r = http.get(f"{base_url}/businesses/", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_update_business(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    r = http.put(f"{base_url}/businesses/{b['id']}", headers=auth_headers, json={"name": "Updated Test Business"})
    assert r.status_code == 200
    assert r.json()["name"] == "Updated Test Business"

def test_delete_business(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    r = http.delete(f"{base_url}/businesses/{b['id']}", headers=auth_headers)
    assert r.status_code == 200
    r = http.get(f"{base_url}/businesses/{b['id']}", headers=auth_headers)
    assert r.status_code == 404

# ================== Business Locations ==================
def create_location(http, headers, base_url, business_id, name=None, address=None):
    payload = {
        "name": name or _uniq_name("Loc"),
        "address": address or "123 Test St",
        "business_id": business_id,
    }
    r = http.post(f"{base_url}/businesses/{business_id}/locations/", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def test_create_business_location(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    loc = create_location(http, auth_headers, base_url, b["id"], name="Downtown Store", address="456 Main St")
    assert loc["name"] == "Downtown Store"

def test_get_business_location(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    loc = create_location(http, auth_headers, base_url, b["id"], name="Main Warehouse")
    r = http.get(f"{base_url}/businesses/locations/{loc['id']}", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["name"] == "Main Warehouse"

def test_get_business_locations(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    _ = create_location(http, auth_headers, base_url, b["id"])
    r = http.get(f"{base_url}/businesses/{b['id']}/locations/", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_update_business_location(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    loc = create_location(http, auth_headers, base_url, b["id"])
    r = http.put(
        f"{base_url}/businesses/locations/{loc['id']}",
        headers=auth_headers,
        json={"address": "123 Updated Ave"},
    )
    assert r.status_code == 200
    assert r.json()["address"] == "123 Updated Ave"

def test_delete_business_location(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    loc = create_location(http, auth_headers, base_url, b["id"])
    r = http.delete(f"{base_url}/businesses/locations/{loc['id']}", headers=auth_headers)
    assert r.status_code == 200
    r = http.get(f"{base_url}/businesses/locations/{loc['id']}", headers=auth_headers)
    assert r.status_code == 404

# ================== Products ==================
def create_product(http, headers, base_url, business_id, name=None, sku=None, price=10.99):
    payload = {
        "name": name or _uniq_name("Product"),
        "description": "Test product",
        "business_id": business_id,
        "price": price,
        "sku": sku or _uniq_sku("SKU"),
    }
    r = http.post(f"{base_url}/products/", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def test_create_product(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    p = create_product(http, auth_headers, base_url, b["id"], name="Another Test Product", sku=_uniq_sku("TEST-SKU-002"))
    assert p["name"] == "Another Test Product"

def test_get_product(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    p = create_product(http, auth_headers, base_url, b["id"], name="Test Product")
    r = http.get(f"{base_url}/products/{p['id']}", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["id"] == p["id"]

def test_get_products(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    _ = create_product(http, auth_headers, base_url, b["id"])
    r = http.get(f"{base_url}/products/", headers=auth_headers, params={"business_id": b["id"]})
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_update_product(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    p = create_product(http, auth_headers, base_url, b["id"])
    r = http.put(f"{base_url}/products/{p['id']}", headers=auth_headers, json={"price": 12.50})
    assert r.status_code == 200
    assert r.json()["price"] == 12.50

def test_delete_product(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    p = create_product(http, auth_headers, base_url, b["id"])
    r = http.delete(f"{base_url}/products/{p['id']}", headers=auth_headers)
    assert r.status_code == 200
    r = http.get(f"{base_url}/products/{p['id']}", headers=auth_headers)
    assert r.status_code == 404

# ================== Customers ==================
def create_customer(http, headers, base_url, business_id, user_id, first_name="John", last_name="Doe", email=None):
    payload = {
        "user_id": user_id,
        "first_name": first_name,
        "last_name": last_name,
        "email": email or _uniq_email("customer"),
        "phone": "1234567890",
        "business_id": business_id,
    }
    r = http.post(f"{base_url}/customers/", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def test_create_customer(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    c = create_customer(http, auth_headers, base_url, b["id"], admin_user["id"], first_name="Jane")
    assert c["first_name"] == "Jane"

def test_get_customer(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    c = create_customer(http, auth_headers, base_url, b["id"], admin_user["id"])
    r = http.get(f"{base_url}/customers/{c['id']}", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == c["email"]

def test_get_customers(http, auth_headers, base_url):
    r = http.get(f"{base_url}/customers/", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_update_customer(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    c = create_customer(http, auth_headers, base_url, b["id"], admin_user["id"])
    r = http.put(f"{base_url}/customers/{c['id']}", headers=auth_headers, json={"phone": "0987654321"})
    assert r.status_code == 200
    assert r.json()["phone"] == "0987654321"

def test_delete_customer(http, auth_headers, admin_user, base_url):
    b = create_business(http, auth_headers, base_url, admin_user["id"])
    c = create_customer(http, auth_headers, base_url, b["id"], admin_user["id"])
    r = http.delete(f"{base_url}/customers/{c['id']}", headers=auth_headers)
    assert r.status_code == 200
    r = http.get(f"{base_url}/customers/{c['id']}", headers=auth_headers)
    assert r.status_code == 404

# ================== Inventory ==================
def create_location_and_product(http, headers, base_url, owner_id):
    b = create_business(http, headers, base_url, owner_id)
    loc = create_location(http, headers, base_url, b["id"])
    prod = create_product(http, headers, base_url, b["id"])
    return b, loc, prod

def create_inventory_item(http, headers, base_url, product_id, business_id, location_id, quantity=100):
    payload = {
        "product_id": product_id,
        "business_id": business_id,
        "quantity": quantity,
        "location_id": location_id,
    }
    r = http.post(f"{base_url}/inventory/", headers=headers, json=payload)
    assert r.status_code in (200, 201), r.text
    return r.json()

def test_create_inventory_item(http, auth_headers, admin_user, base_url):
    b, loc, prod = create_location_and_product(http, auth_headers, base_url, admin_user["id"])
    item = create_inventory_item(http, auth_headers, base_url, prod["id"], b["id"], loc["id"], quantity=50)
    assert item["quantity"] == 50

def test_get_inventory_item(http, auth_headers, admin_user, base_url):
    b, loc, prod = create_location_and_product(http, auth_headers, base_url, admin_user["id"])
    item = create_inventory_item(http, auth_headers, base_url, prod["id"], b["id"], loc["id"])
    r = http.get(f"{base_url}/inventory/{item['id']}", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["quantity"] == 100

def test_get_inventory_items(http, auth_headers, base_url):
    r = http.get(f"{base_url}/inventory/", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_update_inventory_item(http, auth_headers, admin_user, base_url):
    b, loc, prod = create_location_and_product(http, auth_headers, base_url, admin_user["id"])
    item = create_inventory_item(http, auth_headers, base_url, prod["id"], b["id"], loc["id"])
    r = http.put(f"{base_url}/inventory/{item['id']}", headers=auth_headers, json={"quantity": 150})
    assert r.status_code == 200
    assert r.json()["quantity"] == 150

def test_delete_inventory_item(http, auth_headers, admin_user, base_url):
    b, loc, prod = create_location_and_product(http, auth_headers, base_url, admin_user["id"])
    item = create_inventory_item(http, auth_headers, base_url, prod["id"], b["id"], loc["id"])
    r = http.delete(f"{base_url}/inventory/{item['id']}", headers=auth_headers)
    assert r.status_code == 200
    r = http.get(f"{base_url}/inventory/{item['id']}", headers=auth_headers)
    assert r.status_code == 404

# ================== Subscriptions (products/prices) ==================
def create_subscription_product(http, headers, base_url):
    pid = f"prod_{uuid.uuid4().hex[:8]}"
    payload = {"id": pid, "active": True, "name": _uniq_name("Plan")}
    r = http.post(f"{base_url}/subscriptions/products", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def create_price(http, headers, base_url, product_id):
    price_id = f"price_{uuid.uuid4().hex[:8]}"
    payload = {
        "id": price_id,
        "product_id": product_id,
        "active": True,
        "unit_amount": 1000,
        "currency": "usd",
        "type": "recurring",
        "interval": "month",
    }
    r = http.post(f"{base_url}/subscriptions/prices", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def test_get_subscription_products(http, auth_headers, base_url):
    _ = create_subscription_product(http, auth_headers, base_url)
    r = http.get(f"{base_url}/subscriptions/products", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_get_prices(http, auth_headers, base_url):
    sp = create_subscription_product(http, auth_headers, base_url)
    _ = create_price(http, auth_headers, base_url, sp["id"])
    r = http.get(f"{base_url}/subscriptions/prices", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

# ================== Patients ==================
def create_patient(http, headers, base_url, user_id, first_name="Test", last_name="Patient"):
    payload = {
        "user_id": user_id,
        "first_name": first_name,
        "last_name": last_name,
        "date_of_birth": "1990-01-01",
        "contact_info": {"email": _uniq_email("patient"), "phone": "555-1234"},
    }
    r = http.post(f"{base_url}/patients/", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def test_create_patient(http, auth_headers, base_url, admin_user):
    p = create_patient(http, auth_headers, base_url, admin_user["id"], first_name="Another")
    assert p["last_name"] == "Patient"

def test_get_patient(http, auth_headers, base_url, admin_user):
    p = create_patient(http, auth_headers, base_url, admin_user["id"])
    r = http.get(f"{base_url}/patients/{p['id']}", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["first_name"] == "Test"

def test_get_patients(http, auth_headers, base_url):
    r = http.get(f"{base_url}/patients/", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_update_patient(http, auth_headers, base_url, admin_user):
    p = create_patient(http, auth_headers, base_url, admin_user["id"])
    r = http.put(
        f"{base_url}/patients/{p['id']}",
        headers=auth_headers,
        json={"contact_info": {"phone": "555-5678"}},
    )
    assert r.status_code == 200
    assert r.json()["contact_info"]["phone"] == "555-5678"

def test_delete_patient(http, auth_headers, admin_user, base_url):
    p = create_patient(http, auth_headers, base_url, admin_user["id"])
    r = http.delete(f"{base_url}/patients/{p['id']}", headers=auth_headers)
    assert r.status_code == 200
    r = http.get(f"{base_url}/patients/{p['id']}", headers=auth_headers)
    assert r.status_code == 404

# ================== Appointments ==================
def create_appointment(http, headers, base_url, doctor_id, patient_id, when="2024-10-26T10:00:00Z"):
    payload = {
        "doctor_id": doctor_id,
        "patient_id": patient_id,
        "appointment_datetime": when,
        "status": "active",
    }
    r = http.post(f"{base_url}/appointments/", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def test_create_appointment(http, auth_headers, admin_user, base_url):
    p = create_patient(http, auth_headers, base_url, admin_user["id"])
    a = create_appointment(http, auth_headers, base_url, admin_user["id"], p["id"], when="2024-10-27T11:00:00Z")
    assert a["status"] == "active"

def test_get_appointment(http, auth_headers, admin_user, base_url):
    p = create_patient(http, auth_headers, base_url, admin_user["id"])
    a = create_appointment(http, auth_headers, base_url, admin_user["id"], p["id"])
    r = http.get(f"{base_url}/appointments/{a['id']}", headers=auth_headers)
    assert r.status_code == 200

def test_update_appointment(http, auth_headers, admin_user, base_url):
    p = create_patient(http, auth_headers, base_url, admin_user["id"])
    a = create_appointment(http, auth_headers, base_url, admin_user["id"], p["id"])
    r = http.put(
        f"{base_url}/appointments/{a['id']}",
        headers=auth_headers,
        json={"status": "completed"},
    )
    assert r.status_code == 200
    assert r.json()["status"] == "completed"

# ================== Chat ==================
def create_conversation(http, headers, base_url, appointment_id, participant_ids: list, conv_type="medical_consultation"):
    payload = {
        "appointment_id": appointment_id,
        "type": conv_type,
        "participant_ids": participant_ids,
    }
    r = http.post(f"{base_url}/chat/conversations/", headers=headers, json=payload)
    assert r.status_code == 201, r.text
    return r.json()

def test_get_user_conversations(http, auth_headers, admin_user, base_url):
    # This test is a bit complex as it requires appointments and conversations to exist.
    # We will just check if the endpoint returns an empty list for a new user for now.
    r = http.get(f"{base_url}/chat/conversations/", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_send_and_get_messages(http, auth_headers, admin_user, base_url):
    # Create a separate user to act as the patient
    patient_user = register_user(http, base_url, role="patient")
    patient_headers = login_user(http, base_url, patient_user['email'])

    p = create_patient(http, auth_headers, base_url, patient_user["id"])
    a = create_appointment(http, auth_headers, base_url, admin_user["id"], p["id"])
    conv = create_conversation(http, auth_headers, base_url, a["id"], [admin_user["id"], patient_user["id"]])

    # Doctor sends a message
    message_payload = {"conversation_id": conv["id"], "content": "Hello from the doctor"}
    r = http.post(f"{base_url}/chat/messages/", headers=auth_headers, json=message_payload)
    assert r.status_code == 201, r.text
    sent_message_doc = r.json()
    assert sent_message_doc["content"] == "Hello from the doctor"
    assert sent_message_doc["sender_id"] == admin_user["id"]

    # Patient sends a message
    message_payload_patient = {"conversation_id": conv["id"], "content": "Hello from the patient"}
    r_patient = http.post(f"{base_url}/chat/messages/", headers=patient_headers, json=message_payload_patient)
    assert r_patient.status_code == 201, r_patient.text
    sent_message_patient = r_patient.json()
    assert sent_message_patient["content"] == "Hello from the patient"
    assert sent_message_patient["sender_id"] == patient_user["id"]


    # Get messages for the conversation
    r = http.get(f"{base_url}/chat/conversations/{conv['id']}/messages/", headers=auth_headers)
    assert r.status_code == 200
    messages = r.json()
    assert len(messages) == 2
    assert messages[0]["content"] == "Hello from the doctor"
    assert messages[1]["content"] == "Hello from the patient"

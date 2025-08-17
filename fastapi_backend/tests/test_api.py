import requests
import json
import uuid

# --- Configuration ---
BASE_URL = "http://localhost:8001/api/v1"
USER_EMAIL = "user@example.com"
USER_PASSWORD = "user12345678"

# --- Data ---
BUSINESS_NAME = "Clínica Salud Integral"
LOC1_NAME = "Sede Principal"
LOC2_NAME = "Consultorio Anexo"
PROD1_SKU = "CONSULTA-MEDICA-GENERAL"
PROD2_SKU = "SCR-PH-002"
SUB_PROD_ID = "plan_salud_premium"
PRICE_ID = "precio_plan_salud_premium_mensual"

# --- Global variables ---
access_token = ""
headers = {}

# --- API Helper Functions ---
def api_get(endpoint: str, params: dict = None, expected_status: int = 200):
    print(f"\n--- GET {endpoint} ---")
    try:
        response = requests.get(f"{BASE_URL}{endpoint}", headers=headers, params=params)
        if response.status_code == expected_status:
            print(f"SUCCESS: {response.status_code}")
            return response.json()
        else:
            print(f"INFO: Got status {response.status_code}, expected {expected_status}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"FAILED: {e}")
        return None

def api_post(endpoint: str, data: dict):
    print(f"\n--- POST {endpoint} ---")
    try:
        response = requests.post(f"{BASE_URL}{endpoint}", json=data, headers=headers)
        response.raise_for_status()
        print(f"SUCCESS: {response.status_code}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"FAILED: {e}")
        print(f"Response body: {e.response.text if e.response else 'No response'}")
        return None

def api_put(endpoint: str, data: dict):
    print(f"\n--- PUT {endpoint} ---")
    try:
        response = requests.put(f"{BASE_URL}{endpoint}", json=data, headers=headers)
        response.raise_for_status()
        print(f"SUCCESS: {response.status_code}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"FAILED: {e}")
        print(f"Response body: {e.response.text if e.response else 'No response'}")
        return None

def api_delete(endpoint: str):
    print(f"\n--- DELETE {endpoint} ---")
    try:
        response = requests.delete(f"{BASE_URL}{endpoint}", headers=headers)
        response.raise_for_status()
        print(f"SUCCESS: {response.status_code}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"FAILED: {e}")
        return None

def login():
    global access_token, headers
    print("--- Logging in... ---")
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data={"username": USER_EMAIL, "password": USER_PASSWORD})
        response.raise_for_status()
        access_token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}
        print("Login successful.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Login failed: {e}")
        return False

def get_or_create(get_endpoint, create_endpoint, create_data, id_key, id_value, params=None):
    all_items = api_get(get_endpoint, params=params)
    if all_items is not None:
        items_to_check = all_items if isinstance(all_items, list) else [all_items]
        for item in items_to_check:
            if item.get(id_key) == id_value:
                print(f"Found existing {id_key}: {id_value}")
                return item
    print(f"{id_key} '{id_value}' not found, creating...")
    return api_post(create_endpoint, create_data)

def run_tests():
    if not login(): return

    current_user = api_get("/auth/me")
    if not current_user: return

    business = get_or_create("/businesses/", "/businesses/", {"name": BUSINESS_NAME, "owner_id": current_user['id']}, "name", BUSINESS_NAME)
    if not business: return

    location1 = get_or_create(f"/businesses/{business['id']}/locations/", f"/businesses/{business['id']}/locations/", {"name": LOC1_NAME, "business_id": business['id']}, "name", LOC1_NAME)
    if not location1: return
    location2 = get_or_create(f"/businesses/{business['id']}/locations/", f"/businesses/{business['id']}/locations/", {"name": LOC2_NAME, "business_id": business['id']}, "name", LOC2_NAME)
    if not location2: return

    product1 = get_or_create(f"/products/", "/products/", {"name": "Martillo", "price": 15.50, "sku": PROD1_SKU, "business_id": business['id']}, "sku", PROD1_SKU, params={"business_id": business['id']})
    if not product1: return

    # Subscriptions
    sub_prod_data = {"id": SUB_PROD_ID, "name": "Plan Básico", "active": True}
    sub_prod = get_or_create("/subscriptions/products", "/subscriptions/products", sub_prod_data, "id", SUB_PROD_ID)
    if not sub_prod: return

    price_data = {"id": PRICE_ID, "product_id": SUB_PROD_ID, "unit_amount": 1000, "currency": "usd", "type": "recurring", "interval": "month"}
    price = get_or_create("/subscriptions/prices", "/subscriptions/prices", price_data, "id", PRICE_ID)
    if not price: return

    subscription_data = {"id": f"sub_{uuid.uuid4()}", "user_id": current_user['id'], "price_id": PRICE_ID, "status": "active"}
    api_post("/subscriptions/subscriptions", subscription_data)

    print("\n--- Inventory Transfer Test ---")

    # 1. Clean up existing inventory for a clean test run
    print("Cleaning up previous inventory records for this test...")
    inv1_existing = api_get("/inventory/by_location_product/", params={"location_id": location1['id'], "product_id": product1['id']})
    if inv1_existing: api_delete(f"/inventory/{inv1_existing['id']}")
    inv2_existing = api_get("/inventory/by_location_product/", params={"location_id": location2['id'], "product_id": product1['id']})
    if inv2_existing: api_delete(f"/inventory/{inv2_existing['id']}")

    # 2. Create initial inventory
    inventory1 = api_post("/inventory/", {"product_id": product1['id'], "location_id": location1['id'], "quantity": 100})
    if not inventory1: return

    # 3. Create and process stock transfer
    transfer_data = {"business_id": business['id'], "from_location_id": location1['id'], "to_location_id": location2['id'], "status": "pending"}
    transfer = api_post("/stock-transfers/", transfer_data)
    if not transfer: return

    transfer_item_data = {"transfer_id": transfer['id'], "product_id": product1['id'], "quantity": 20}
    transfer_item = api_post("/stock-transfer-items/", transfer_item_data)
    if not transfer_item: return

    completed_transfer = api_put(f"/stock-transfers/{transfer['id']}", {"status": "completed"})
    if not completed_transfer: return

    # 4. Verify final inventory levels
    print("\n--- Verifying final inventory levels ---")
    final_inv1 = api_get("/inventory/by_location_product/", params={"location_id": location1['id'], "product_id": product1['id']})
    final_inv2 = api_get("/inventory/by_location_product/", params={"location_id": location2['id'], "product_id": product1['id']})

    if final_inv1 and final_inv1.get('quantity') == 80:
        print("SUCCESS: Source inventory is correct (80).")
    else:
        print(f"FAILURE: Source inventory is incorrect. Expected 80, got {final_inv1.get('quantity') if final_inv1 else 'not found'}.")

    if final_inv2 and final_inv2.get('quantity') == 20:
        print("SUCCESS: Destination inventory is correct (20).")
    else:
        print(f"FAILURE: Destination inventory is incorrect. Expected 20, got {final_inv2.get('quantity') if final_inv2 else 'not found'}.")

    print("\n--- Test script finished. ---")

    # --- New Tests for Appointments, Patients, and Chat ---
    print("\n--- Running new tests for Appointments, Patients, and Chat ---")

    # 1. Create a doctor user
    doctor_data = {
        "email": "doctor@example.com",
        "password": "doctor12345678",
        "first_name": "Doctor",
        "last_name": "Who",
        "role": "doctor"
    }
    # We use a direct post here, assuming the doctor might not exist.
    # A more robust test would check first or handle the creation failure.
    print("\n--- Creating Doctor ---")
    doctor_user_response = requests.post(f"{BASE_URL}/auth/register", json=doctor_data)
    if doctor_user_response.status_code not in [200, 201, 400]: # 400 if user already exists
        print(f"FAILED: Could not create or verify doctor. Status: {doctor_user_response.status_code}")
        return
    
    # Log in as the doctor to get their token and ID
    doctor_login_data = {"username": "doctor@example.com", "password": "doctor12345678"}
    print("--- Logging in as Doctor... ---")
    try:
        doc_response = requests.post(f"{BASE_URL}/auth/login", data=doctor_login_data)
        doc_response.raise_for_status()
        doctor_access_token = doc_response.json()["access_token"]
        doctor_headers = {"Authorization": f"Bearer {doctor_access_token}"}
        doctor_user = requests.get(f"{BASE_URL}/auth/me", headers=doctor_headers).json()
        print("Doctor login successful.")
    except requests.exceptions.RequestException as e:
        print(f"Doctor login failed: {e}")
        return

    # 2. Create a patient profile for the original user
    patient_profile = get_or_create("/patients/", "/patients/", {"user_id": current_user['id']}, "user_id", current_user['id'])
    if not patient_profile: return

    # 3. Create an appointment
    appointment_data = {
        "doctor_id": doctor_user['id'],
        "patient_id": patient_profile['id'],
        "appointment_datetime": "2025-09-15T14:30:00Z",
        "reason": "Consulta de rutina"
    }
    appointment = api_post("/appointments/", appointment_data)
    if not appointment: return

    # 4. Add a document to the appointment (as the doctor)
    doc_data = {
        "appointment_id": appointment['id'],
        "document_type": "medical_report",
        "content": "El paciente presenta un excelente estado de salud."
    }
    # Temporarily use doctor's headers for this action
    original_headers = headers.copy()
    headers.update(doctor_headers)
    appointment_doc = api_post("/appointment-documents/", doc_data)
    if not appointment_doc: return
    headers.clear()
    headers.update(original_headers) # Revert to original user's headers

    # 5. Create a chat conversation for the appointment
    chat_data = {
        "type": "medical_consultation",
        "appointment_id": appointment['id'],
        "participant_ids": [current_user['id'], doctor_user['id']]
    }
    conversation = api_post("/chat/conversations/", chat_data)
    if not conversation: return

    # 6. Send a message as the patient
    message_data = {
        "conversation_id": conversation['id'],
        "sender_id": current_user['id'],
        "content": "Hola Doctor, gracias por la consulta."
    }
    message1 = api_post("/chat/messages/", message_data)
    if not message1: return

    # 7. Send a reply as the doctor
    doctor_message_data = {
        "conversation_id": conversation['id'],
        "sender_id": doctor_user['id'],
        "content": "De nada, ¡cuídese mucho!"
    }
    headers.update(doctor_headers) # Switch to doctor
    message2 = api_post("/chat/messages/", doctor_message_data)
    if not message2: return
    headers.clear()
    headers.update(original_headers) # Revert to original user

    # 8. Verify messages in the conversation
    messages = api_get(f"/chat/conversations/{conversation['id']}/messages/")
    if messages and len(messages) == 2:
        print("SUCCESS: Correct number of messages found in conversation.")
    else:
        print(f"FAILURE: Incorrect number of messages. Expected 2, got {len(messages) if messages is not None else 0}.")

    print("\n--- New tests finished. ---")

if __name__ == "__main__":
    run_tests()

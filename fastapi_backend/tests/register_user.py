import requests

BASE_URL = "http://localhost:8001/api/v1"

user_data = {
  "email": "user@example.com",
  "first_name": "Raul",
  "last_name": "Gonzalez",
  "phone": "string",
  "avatar_url": "string",
  "billing_address": {},
  "payment_method": {},
  "password": "user12345678"
}

print("--- Registering test user... ---")
try:
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    response.raise_for_status()
    print("User registered successfully.")
    print(response.json())
except requests.exceptions.RequestException as e:
    print(f"User registration failed: {e}")
    print(f"Response body: {e.response.text if e.response else 'No response'}")

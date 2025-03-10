// API URLs
// Para emulador Android
export const API_BASE_URL = 'http://10.0.2.2:4000/api';

// Para iOS
// export const API_BASE_URL = 'http://localhost:4000/api';

// Para dispositivos físicos (reemplazar con tu IP local)
// export const API_BASE_URL = 'http://192.168.1.X:4000/api';

// Para pruebas locales (sin usar el emulador)
// export const API_BASE_URL = 'http://127.0.0.1:4000/api';

// Endpoints
export const ENDPOINTS = {
  // Auth
  REGISTER: '/users/register',
  LOGIN: '/users/login',
  PROFILE: '/users/profile',
  
  // Customers
  CUSTOMERS: '/customers',
  
  // Products
  PRODUCTS: '/products',
  
  // Inventory
  INVENTORY: '/inventory',
  STOCK_TRANSFERS: '/inventory/transfers',
  
  // Businesses
  BUSINESSES: '/businesses',
  BUSINESS_LOCATIONS: '/businesses/locations',
  
  // Subscriptions
  SUBSCRIPTIONS: '/subscriptions',
  SUBSCRIPTION_PRODUCTS: '/subscriptions/products',
  PRICES: '/subscriptions/prices',
  
  // Health check
  HEALTH: '/health'
}; 
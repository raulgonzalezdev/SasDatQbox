import { ENDPOINTS } from '../constants/api';
import * as api from './api';

// Interfaces para los datos de clientes
export interface Customer {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerInput {
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

// Función para obtener todos los clientes
export const getCustomers = async (businessId?: string): Promise<Customer[]> => {
  const endpoint = businessId 
    ? `${ENDPOINTS.CUSTOMERS}?business_id=${businessId}` 
    : ENDPOINTS.CUSTOMERS;
  
  return api.get<Customer[]>(endpoint, { requireAuth: true });
};

// Función para obtener un cliente por ID
export const getCustomerById = async (customerId: string): Promise<Customer> => {
  return api.get<Customer>(`${ENDPOINTS.CUSTOMERS}/${customerId}`, { requireAuth: true });
};

// Función para crear un nuevo cliente
export const createCustomer = async (customerData: CustomerInput): Promise<Customer> => {
  return api.post<Customer>(ENDPOINTS.CUSTOMERS, customerData, { requireAuth: true });
};

// Función para actualizar un cliente
export const updateCustomer = async (customerId: string, customerData: Partial<CustomerInput>): Promise<Customer> => {
  return api.patch<Customer>(`${ENDPOINTS.CUSTOMERS}/${customerId}`, customerData, { requireAuth: true });
};

// Función para eliminar un cliente
export const deleteCustomer = async (customerId: string): Promise<void> => {
  return api.del<void>(`${ENDPOINTS.CUSTOMERS}/${customerId}`, { requireAuth: true });
}; 
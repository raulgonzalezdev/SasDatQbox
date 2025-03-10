import { ENDPOINTS } from '../constants/api';
import * as api from './api';

// Interfaces para los datos de negocios
export interface Business {
  id: string;
  owner_id: string;
  name: string;
  logo_url?: string;
  tax_id?: string;
  email?: string;
  phone?: string;
  website?: string;
  currency: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  settings: BusinessSettings;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessSettings {
  tax_percentage?: number;
  default_language?: string;
  timezone?: string;
  receipt_footer?: string;
  receipt_header?: string;
  [key: string]: any;
}

export interface BusinessInput {
  name: string;
  logo_url?: string;
  tax_id?: string;
  email?: string;
  phone?: string;
  website?: string;
  currency: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  settings?: BusinessSettings;
}

// Interfaces para las ubicaciones de negocios
export interface BusinessLocation {
  id: string;
  business_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  is_main: boolean;
  settings?: LocationSettings;
  created_at: Date;
  updated_at: Date;
}

export interface LocationSettings {
  tax_percentage?: number;
  receipt_printer_id?: string;
  label_printer_id?: string;
  cash_drawer_id?: string;
  [key: string]: any;
}

export interface BusinessLocationInput {
  business_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  is_main?: boolean;
  settings?: LocationSettings;
}

// Función para obtener todos los negocios del usuario
export const getBusinesses = async (): Promise<Business[]> => {
  return api.get<Business[]>(ENDPOINTS.BUSINESSES, { requireAuth: true });
};

// Función para obtener un negocio por ID
export const getBusinessById = async (businessId: string): Promise<Business> => {
  return api.get<Business>(`${ENDPOINTS.BUSINESSES}/${businessId}`, { requireAuth: true });
};

// Función para crear un nuevo negocio
export const createBusiness = async (businessData: BusinessInput): Promise<Business> => {
  return api.post<Business>(ENDPOINTS.BUSINESSES, businessData, { requireAuth: true });
};

// Función para actualizar un negocio
export const updateBusiness = async (businessId: string, businessData: Partial<BusinessInput>): Promise<Business> => {
  return api.patch<Business>(`${ENDPOINTS.BUSINESSES}/${businessId}`, businessData, { requireAuth: true });
};

// Función para eliminar un negocio
export const deleteBusiness = async (businessId: string): Promise<void> => {
  return api.del<void>(`${ENDPOINTS.BUSINESSES}/${businessId}`, { requireAuth: true });
};

// Función para obtener todas las ubicaciones de un negocio
export const getBusinessLocations = async (businessId: string): Promise<BusinessLocation[]> => {
  return api.get<BusinessLocation[]>(`${ENDPOINTS.BUSINESSES}/${businessId}/locations`, { requireAuth: true });
};

// Función para obtener una ubicación por ID
export const getLocationById = async (locationId: string): Promise<BusinessLocation> => {
  return api.get<BusinessLocation>(`${ENDPOINTS.BUSINESS_LOCATIONS}/${locationId}`, { requireAuth: true });
};

// Función para crear una nueva ubicación
export const createLocation = async (locationData: BusinessLocationInput): Promise<BusinessLocation> => {
  return api.post<BusinessLocation>(ENDPOINTS.BUSINESS_LOCATIONS, locationData, { requireAuth: true });
};

// Función para actualizar una ubicación
export const updateLocation = async (locationId: string, locationData: Partial<BusinessLocationInput>): Promise<BusinessLocation> => {
  return api.patch<BusinessLocation>(`${ENDPOINTS.BUSINESS_LOCATIONS}/${locationId}`, locationData, { requireAuth: true });
};

// Función para eliminar una ubicación
export const deleteLocation = async (locationId: string): Promise<void> => {
  return api.del<void>(`${ENDPOINTS.BUSINESS_LOCATIONS}/${locationId}`, { requireAuth: true });
}; 
import { ENDPOINTS } from '../constants/api';
import * as api from './api';

// Interfaces para los datos de productos de suscripción
export interface SubscriptionProduct {
  id: string;
  name: string;
  description?: string;
  features: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionProductInput {
  name: string;
  description?: string;
  features: string[];
  is_active?: boolean;
}

// Interfaces para los precios
export interface Price {
  id: string;
  product_id: string;
  nickname?: string;
  unit_amount: number;
  currency: string;
  recurring?: PriceRecurring;
  type: 'one_time' | 'recurring';
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface PriceRecurring {
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  trial_period_days?: number;
}

export interface PriceInput {
  product_id: string;
  nickname?: string;
  unit_amount: number;
  currency: string;
  recurring?: PriceRecurring;
  type: 'one_time' | 'recurring';
  is_active?: boolean;
  metadata?: Record<string, any>;
}

// Interfaces para las suscripciones
export interface Subscription {
  id: string;
  user_id: string;
  price_id: string;
  status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  trial_start?: Date;
  trial_end?: Date;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionInput {
  price_id: string;
  trial_period_days?: number;
  metadata?: Record<string, any>;
}

// Función para obtener todos los productos de suscripción
export const getSubscriptionProducts = async (): Promise<SubscriptionProduct[]> => {
  return api.get<SubscriptionProduct[]>(ENDPOINTS.SUBSCRIPTION_PRODUCTS, { requireAuth: false });
};

// Función para obtener un producto de suscripción por ID
export const getSubscriptionProductById = async (productId: string): Promise<SubscriptionProduct> => {
  return api.get<SubscriptionProduct>(`${ENDPOINTS.SUBSCRIPTION_PRODUCTS}/${productId}`, { requireAuth: false });
};

// Función para obtener los precios de un producto de suscripción
export const getProductPrices = async (productId: string): Promise<Price[]> => {
  return api.get<Price[]>(`${ENDPOINTS.SUBSCRIPTION_PRODUCTS}/${productId}/prices`, { requireAuth: false });
};

// Función para obtener un precio por ID
export const getPriceById = async (priceId: string): Promise<Price> => {
  return api.get<Price>(`${ENDPOINTS.PRICES}/${priceId}`, { requireAuth: false });
};

// Función para crear una suscripción
export const createSubscription = async (subscriptionData: SubscriptionInput): Promise<{ clientSecret: string }> => {
  return api.post<{ clientSecret: string }>(ENDPOINTS.SUBSCRIPTIONS, subscriptionData, { requireAuth: true });
};

// Función para obtener la suscripción actual del usuario
export const getCurrentSubscription = async (): Promise<Subscription | null> => {
  try {
    return await api.get<Subscription>(`${ENDPOINTS.SUBSCRIPTIONS}/current`, { requireAuth: true });
  } catch (error) {
    // Si no hay suscripción, devolver null
    return null;
  }
};

// Función para cancelar una suscripción
export const cancelSubscription = async (atPeriodEnd: boolean = true): Promise<Subscription> => {
  return api.post<Subscription>(`${ENDPOINTS.SUBSCRIPTIONS}/cancel`, { atPeriodEnd }, { requireAuth: true });
};

// Función para reactivar una suscripción cancelada
export const reactivateSubscription = async (): Promise<Subscription> => {
  return api.post<Subscription>(`${ENDPOINTS.SUBSCRIPTIONS}/reactivate`, {}, { requireAuth: true });
}; 
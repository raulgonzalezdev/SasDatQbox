'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface SubscriptionProduct {
  id: string;
  active: boolean;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPrice {
  id: string;
  product_id: string;
  active: boolean;
  unit_amount: number;
  currency: string;
  type: 'recurring' | 'one_time';
  interval?: 'month' | 'year' | 'week' | 'day';
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionProductPayload {
  id: string;
  active: boolean;
  name: string;
}

export interface CreateSubscriptionPricePayload {
  id: string;
  product_id: string;
  active: boolean;
  unit_amount: number;
  currency: string;
  type: 'recurring' | 'one_time';
  interval?: 'month' | 'year' | 'week' | 'day';
}

// --- API Functions ---
const fetchSubscriptionProducts = async (): Promise<SubscriptionProduct[]> => {
  const res = await customFetch('/subscriptions/products');
  if (!res.ok) {
    throw new Error('Failed to fetch subscription products');
  }
  return res.json();
};

const fetchSubscriptionPrices = async (): Promise<SubscriptionPrice[]> => {
  const res = await customFetch('/subscriptions/prices');
  if (!res.ok) {
    throw new Error('Failed to fetch subscription prices');
  }
  return res.json();
};

const createSubscriptionProduct = async (payload: CreateSubscriptionProductPayload): Promise<SubscriptionProduct> => {
  const res = await customFetch('/subscriptions/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create subscription product');
  }
  return res.json();
};

const createSubscriptionPrice = async (payload: CreateSubscriptionPricePayload): Promise<SubscriptionPrice> => {
  const res = await customFetch('/subscriptions/prices', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create subscription price');
  }
  return res.json();
};

// --- Main Hook ---
export function useSubscriptions() {
  const queryClient = useQueryClient();

  // Query for subscription products
  const { data: subscriptionProducts = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['subscription-products'],
    queryFn: fetchSubscriptionProducts,
    retry: 1,
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Query for subscription prices
  const { data: subscriptionPrices = [], isLoading: pricesLoading, error: pricesError } = useQuery({
    queryKey: ['subscription-prices'],
    queryFn: fetchSubscriptionPrices,
    retry: 1,
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Mutation for creating subscription product
  const { mutate: createSubscriptionProductMutation, isPending: isCreatingProduct } = useMutation({
    mutationFn: createSubscriptionProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-products'] });
      toast.success('Producto de suscripción creado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for creating subscription price
  const { mutate: createSubscriptionPriceMutation, isPending: isCreatingPrice } = useMutation({
    mutationFn: createSubscriptionPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-prices'] });
      toast.success('Precio de suscripción creado exitosamente');
    },
    onError: handleApiError,
  });

  // Helper function to get subscription product by ID
  const getSubscriptionProductById = (id: string) => {
    return subscriptionProducts.find(product => product.id === id);
  };

  // Helper function to get prices by product ID
  const getPricesByProductId = (productId: string) => {
    return subscriptionPrices.filter(price => price.product_id === productId);
  };

  // Helper function to get active subscription products
  const getActiveSubscriptionProducts = () => {
    return subscriptionProducts.filter(product => product.active);
  };

  // Helper function to get active subscription prices
  const getActiveSubscriptionPrices = () => {
    return subscriptionPrices.filter(price => price.active);
  };

  // Helper function to get recurring subscription prices
  const getRecurringSubscriptionPrices = () => {
    return subscriptionPrices.filter(price => price.type === 'recurring');
  };

  // Helper function to get one-time subscription prices
  const getOneTimeSubscriptionPrices = () => {
    return subscriptionPrices.filter(price => price.type === 'one_time');
  };

  // Helper function to get prices by currency
  const getPricesByCurrency = (currency: string) => {
    return subscriptionPrices.filter(price => price.currency === currency);
  };

  // Helper function to get prices by interval
  const getPricesByInterval = (interval: string) => {
    return subscriptionPrices.filter(price => price.interval === interval);
  };

  return {
    subscriptionProducts,
    subscriptionPrices,
    isLoading: productsLoading || pricesLoading,
    error: productsError || pricesError,
    createSubscriptionProduct: createSubscriptionProductMutation,
    createSubscriptionPrice: createSubscriptionPriceMutation,
    isCreatingProduct,
    isCreatingPrice,
    getSubscriptionProductById,
    getPricesByProductId,
    getActiveSubscriptionProducts,
    getActiveSubscriptionPrices,
    getRecurringSubscriptionPrices,
    getOneTimeSubscriptionPrices,
    getPricesByCurrency,
    getPricesByInterval,
  };
}

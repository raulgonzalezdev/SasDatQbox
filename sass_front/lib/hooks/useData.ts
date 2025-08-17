import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';

// Define types for your data based on your FastAPI backend models
// These are examples, adjust them to match your actual FastAPI response structures
interface UserDetails {
  id: string;
  full_name: string;
  email: string;
  // Add other user details fields as per your FastAPI User model
}

interface Product {
  id: string;
  name: string;
  description: string;
  // Add other product fields
}

interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  interval: string;
  // Add other price fields
}

interface Subscription {
  id: string;
  status: string;
  // Add other subscription fields
}

export const useUserDetails = () => {
  return useQuery<UserDetails, Error>({
    queryKey: ['userDetails'],
    queryFn: () => apiFetch<UserDetails>('/users/me'), // Adjust endpoint as per your FastAPI setup
  });
};

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => apiFetch<Product[]>('/products'), // Adjust endpoint as per your FastAPI setup
  });
};

export const useSubscription = () => {
  return useQuery<Subscription, Error>({
    queryKey: ['subscription'],
    queryFn: () => apiFetch<Subscription>('/subscriptions/me'), // Adjust endpoint as per your FastAPI setup
  });
};

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface Customer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerPayload {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_id: string;
}

export interface UpdateCustomerPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

// --- API Functions ---
const fetchCustomers = async (): Promise<Customer[]> => {
  const res = await customFetch('/customers/');
  if (!res.ok) {
    throw new Error('Failed to fetch customers');
  }
  return res.json();
};

const fetchCustomer = async (id: string): Promise<Customer> => {
  const res = await customFetch(`/customers/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch customer');
  }
  return res.json();
};

const createCustomer = async (payload: CreateCustomerPayload): Promise<Customer> => {
  const res = await customFetch('/customers/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create customer');
  }
  return res.json();
};

const updateCustomer = async ({ id, payload }: { id: string; payload: UpdateCustomerPayload }): Promise<Customer> => {
  const res = await customFetch(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update customer');
  }
  return res.json();
};

const deleteCustomer = async (id: string): Promise<void> => {
  const res = await customFetch(`/customers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete customer');
  }
};

// --- Main Hook ---
export function useCustomers() {
  const queryClient = useQueryClient();

  // Query for all customers
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    retry: 1,
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Query for single customer
  const useCustomer = (id: string) => {
    return useQuery({
      queryKey: ['customers', id],
      queryFn: () => fetchCustomer(id),
      enabled: !!id,
    });
  };

  // Mutation for creating customer
  const { mutate: createCustomerMutation, isPending: isCreating } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente creado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for updating customer
  const { mutate: updateCustomerMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for deleting customer
  const { mutate: deleteCustomerMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cliente eliminado exitosamente');
    },
    onError: handleApiError,
  });

  // Helper function to get customer by ID
  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  // Helper function to search customers by name
  const searchCustomersByName = (searchTerm: string) => {
    if (!searchTerm.trim()) return customers;
    
    const term = searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.first_name.toLowerCase().includes(term) ||
      customer.last_name.toLowerCase().includes(term) ||
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(term)
    );
  };

  // Helper function to get customers by business
  const getCustomersByBusiness = (businessId: string) => {
    return customers.filter(customer => customer.business_id === businessId);
  };

  // Helper function to search customers by email
  const searchCustomersByEmail = (email: string) => {
    if (!email.trim()) return customers;
    
    const term = email.toLowerCase();
    return customers.filter(customer => 
      customer.email.toLowerCase().includes(term)
    );
  };

  return {
    customers,
    isLoading,
    error,
    useCustomer,
    createCustomer: createCustomerMutation,
    updateCustomer: updateCustomerMutation,
    deleteCustomer: deleteCustomerMutation,
    isCreating,
    isUpdating,
    isDeleting,
    getCustomerById,
    searchCustomersByName,
    getCustomersByBusiness,
    searchCustomersByEmail,
  };
}

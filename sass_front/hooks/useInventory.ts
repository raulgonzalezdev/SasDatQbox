'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface InventoryItem {
  id: string;
  product_id: string;
  business_id: string;
  quantity: number;
  location_id: string;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    sku: string;
    price: number;
  };
  location?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface CreateInventoryItemPayload {
  product_id: string;
  business_id: string;
  quantity: number;
  location_id: string;
}

export interface UpdateInventoryItemPayload {
  quantity?: number;
  location_id?: string;
}

// --- API Functions ---
const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  const res = await customFetch('/inventory/');
  if (!res.ok) {
    throw new Error('Failed to fetch inventory items');
  }
  return res.json();
};

const fetchInventoryItem = async (id: string): Promise<InventoryItem> => {
  const res = await customFetch(`/inventory/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch inventory item');
  }
  return res.json();
};

const createInventoryItem = async (payload: CreateInventoryItemPayload): Promise<InventoryItem> => {
  const res = await customFetch('/inventory/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create inventory item');
  }
  return res.json();
};

const updateInventoryItem = async ({ id, payload }: { id: string; payload: UpdateInventoryItemPayload }): Promise<InventoryItem> => {
  const res = await customFetch(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update inventory item');
  }
  return res.json();
};

const deleteInventoryItem = async (id: string): Promise<void> => {
  const res = await customFetch(`/inventory/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete inventory item');
  }
};

// --- Main Hook ---
export function useInventory() {
  const queryClient = useQueryClient();

  // Query for all inventory items
  const { data: inventoryItems = [], isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventoryItems,
    retry: 1,
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Query for single inventory item
  const useInventoryItem = (id: string) => {
    return useQuery({
      queryKey: ['inventory', id],
      queryFn: () => fetchInventoryItem(id),
      enabled: !!id,
    });
  };

  // Mutation for creating inventory item
  const { mutate: createInventoryItemMutation, isPending: isCreating } = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item de inventario creado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for updating inventory item
  const { mutate: updateInventoryItemMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item de inventario actualizado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for deleting inventory item
  const { mutate: deleteInventoryItemMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item de inventario eliminado exitosamente');
    },
    onError: handleApiError,
  });

  // Helper function to get inventory item by ID
  const getInventoryItemById = (id: string) => {
    return inventoryItems.find(item => item.id === id);
  };

  // Helper function to get inventory items by business
  const getInventoryItemsByBusiness = (businessId: string) => {
    return inventoryItems.filter(item => item.business_id === businessId);
  };

  // Helper function to get inventory items by location
  const getInventoryItemsByLocation = (locationId: string) => {
    return inventoryItems.filter(item => item.location_id === locationId);
  };

  // Helper function to get inventory items by product
  const getInventoryItemsByProduct = (productId: string) => {
    return inventoryItems.filter(item => item.product_id === productId);
  };

  // Helper function to get low stock items (quantity < threshold)
  const getLowStockItems = (threshold: number = 10) => {
    return inventoryItems.filter(item => item.quantity < threshold);
  };

  // Helper function to get out of stock items
  const getOutOfStockItems = () => {
    return inventoryItems.filter(item => item.quantity === 0);
  };

  // Helper function to calculate total inventory value
  const getTotalInventoryValue = () => {
    return inventoryItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return {
    inventoryItems,
    isLoading,
    error,
    useInventoryItem,
    createInventoryItem: createInventoryItemMutation,
    updateInventoryItem: updateInventoryItemMutation,
    deleteInventoryItem: deleteInventoryItemMutation,
    isCreating,
    isUpdating,
    isDeleting,
    getInventoryItemById,
    getInventoryItemsByBusiness,
    getInventoryItemsByLocation,
    getInventoryItemsByProduct,
    getLowStockItems,
    getOutOfStockItems,
    getTotalInventoryValue,
  };
}

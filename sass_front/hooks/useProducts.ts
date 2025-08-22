'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface Product {
  id: string;
  name: string;
  description: string;
  business_id: string;
  price: number;
  sku: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  business_id: string;
  price: number;
  sku: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
}

// --- API Functions ---
const fetchProducts = async (businessId?: string): Promise<Product[]> => {
  const url = businessId ? `/products/?business_id=${businessId}` : '/products/';
  const res = await customFetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

const fetchProduct = async (id: string): Promise<Product> => {
  const res = await customFetch(`/products/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
};

const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const res = await customFetch('/products/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create product');
  }
  return res.json();
};

const updateProduct = async ({ id, payload }: { id: string; payload: UpdateProductPayload }): Promise<Product> => {
  const res = await customFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update product');
  }
  return res.json();
};

const deleteProduct = async (id: string): Promise<void> => {
  const res = await customFetch(`/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete product');
  }
};

// --- Main Hook ---
export function useProducts(businessId?: string) {
  const queryClient = useQueryClient();

  // Query for all products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', businessId],
    queryFn: () => fetchProducts(businessId),
    retry: 1,
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Query for single product
  const useProduct = (id: string) => {
    return useQuery({
      queryKey: ['products', 'single', id],
      queryFn: () => fetchProduct(id),
      enabled: !!id,
    });
  };

  // Mutation for creating product
  const { mutate: createProductMutation, isPending: isCreating } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for updating product
  const { mutate: updateProductMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for deleting product
  const { mutate: deleteProductMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado exitosamente');
    },
    onError: handleApiError,
  });

  // Helper function to get product by ID
  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  // Helper function to search products by name
  const searchProductsByName = (searchTerm: string) => {
    if (!searchTerm.trim()) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term)
    );
  };

  // Helper function to get products by price range
  const getProductsByPriceRange = (minPrice: number, maxPrice: number) => {
    return products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  };

  return {
    products,
    isLoading,
    error,
    useProduct,
    createProduct: createProductMutation,
    updateProduct: updateProductMutation,
    deleteProduct: deleteProductMutation,
    isCreating,
    isUpdating,
    isDeleting,
    getProductById,
    searchProductsByName,
    getProductsByPriceRange,
  };
}

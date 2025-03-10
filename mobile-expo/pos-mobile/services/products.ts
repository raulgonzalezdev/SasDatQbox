import { ENDPOINTS } from '../constants/api';
import * as api from './api';

// Interfaces para los datos de productos
export interface Product {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  image_url?: string;
  category?: string;
  tax_rate?: number;
  price: number;
  cost_price?: number;
  unit?: string;
  is_active: boolean;
  is_service: boolean;
  is_stock_tracked: boolean;
  attributes?: ProductAttributes;
  created_at: Date;
  updated_at: Date;
}

export interface ProductAttributes {
  color?: string;
  size?: string;
  weight?: number;
  dimensions?: string;
  [key: string]: any;
}

export interface ProductInput {
  business_id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  image_url?: string;
  category?: string;
  tax_rate?: number;
  price: number;
  cost_price?: number;
  unit?: string;
  is_active?: boolean;
  is_service?: boolean;
  is_stock_tracked?: boolean;
  attributes?: ProductAttributes;
}

// Función para obtener todos los productos
export const getProducts = async (businessId?: string, categoryFilter?: string, isActive?: boolean): Promise<Product[]> => {
  let endpoint = ENDPOINTS.PRODUCTS;
  const queryParams = [];
  
  if (businessId) {
    queryParams.push(`business_id=${businessId}`);
  }
  
  if (categoryFilter) {
    queryParams.push(`category=${categoryFilter}`);
  }
  
  if (isActive !== undefined) {
    queryParams.push(`is_active=${isActive}`);
  }
  
  if (queryParams.length > 0) {
    endpoint += `?${queryParams.join('&')}`;
  }
  
  return api.get<Product[]>(endpoint, { requireAuth: true });
};

// Función para obtener un producto por ID
export const getProductById = async (productId: string): Promise<Product> => {
  return api.get<Product>(`${ENDPOINTS.PRODUCTS}/${productId}`, { requireAuth: true });
};

// Función para crear un nuevo producto
export const createProduct = async (productData: ProductInput): Promise<Product> => {
  return api.post<Product>(ENDPOINTS.PRODUCTS, productData, { requireAuth: true });
};

// Función para actualizar un producto
export const updateProduct = async (productId: string, productData: Partial<ProductInput>): Promise<Product> => {
  return api.patch<Product>(`${ENDPOINTS.PRODUCTS}/${productId}`, productData, { requireAuth: true });
};

// Función para eliminar un producto
export const deleteProduct = async (productId: string): Promise<void> => {
  return api.del<void>(`${ENDPOINTS.PRODUCTS}/${productId}`, { requireAuth: true });
};

// Función para buscar productos por nombre, SKU o código de barras
export const searchProducts = async (query: string, businessId?: string): Promise<Product[]> => {
  let endpoint = `${ENDPOINTS.PRODUCTS}/search?q=${encodeURIComponent(query)}`;
  
  if (businessId) {
    endpoint += `&business_id=${businessId}`;
  }
  
  return api.get<Product[]>(endpoint, { requireAuth: true });
}; 
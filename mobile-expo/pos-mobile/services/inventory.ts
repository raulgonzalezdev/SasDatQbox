import { ENDPOINTS } from '../constants/api';
import * as api from './api';

// Interfaces para los datos de inventario
export interface Inventory {
  id: string;
  product_id: string;
  location_id: string;
  quantity: number;
  min_quantity?: number;
  max_quantity?: number;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryInput {
  product_id: string;
  location_id: string;
  quantity: number;
  min_quantity?: number;
  max_quantity?: number;
}

// Interfaces para las transferencias de stock
export interface StockTransfer {
  id: string;
  business_id: string;
  source_location_id: string;
  destination_location_id: string;
  reference_no?: string;
  status: 'draft' | 'pending' | 'in_transit' | 'completed' | 'cancelled';
  shipping_details?: string;
  notes?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface StockTransferInput {
  business_id: string;
  source_location_id: string;
  destination_location_id: string;
  reference_no?: string;
  status?: 'draft' | 'pending' | 'in_transit' | 'completed' | 'cancelled';
  shipping_details?: string;
  notes?: string;
}

export interface StockTransferItem {
  id: string;
  transfer_id: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface StockTransferItemInput {
  transfer_id: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  notes?: string;
}

// Función para obtener el inventario de un producto en una ubicación
export const getInventory = async (productId: string, locationId: string): Promise<Inventory> => {
  return api.get<Inventory>(`${ENDPOINTS.INVENTORY}/${productId}/${locationId}`, { requireAuth: true });
};

// Función para obtener todo el inventario de una ubicación
export const getLocationInventory = async (locationId: string): Promise<Inventory[]> => {
  return api.get<Inventory[]>(`${ENDPOINTS.INVENTORY}/location/${locationId}`, { requireAuth: true });
};

// Función para obtener el inventario de un producto en todas las ubicaciones
export const getProductInventory = async (productId: string): Promise<Inventory[]> => {
  return api.get<Inventory[]>(`${ENDPOINTS.INVENTORY}/product/${productId}`, { requireAuth: true });
};

// Función para actualizar el inventario
export const updateInventory = async (inventoryData: InventoryInput): Promise<Inventory> => {
  return api.post<Inventory>(ENDPOINTS.INVENTORY, inventoryData, { requireAuth: true });
};

// Función para ajustar la cantidad de inventario
export const adjustInventory = async (
  productId: string, 
  locationId: string, 
  adjustment: number, 
  reason?: string
): Promise<Inventory> => {
  return api.patch<Inventory>(
    `${ENDPOINTS.INVENTORY}/adjust`,
    { product_id: productId, location_id: locationId, adjustment, reason },
    { requireAuth: true }
  );
};

// Función para obtener todas las transferencias de stock
export const getStockTransfers = async (businessId: string, status?: string): Promise<StockTransfer[]> => {
  let endpoint = `${ENDPOINTS.STOCK_TRANSFERS}?business_id=${businessId}`;
  
  if (status) {
    endpoint += `&status=${status}`;
  }
  
  return api.get<StockTransfer[]>(endpoint, { requireAuth: true });
};

// Función para obtener una transferencia de stock por ID
export const getStockTransferById = async (transferId: string): Promise<StockTransfer> => {
  return api.get<StockTransfer>(`${ENDPOINTS.STOCK_TRANSFERS}/${transferId}`, { requireAuth: true });
};

// Función para crear una nueva transferencia de stock
export const createStockTransfer = async (transferData: StockTransferInput): Promise<StockTransfer> => {
  return api.post<StockTransfer>(ENDPOINTS.STOCK_TRANSFERS, transferData, { requireAuth: true });
};

// Función para actualizar una transferencia de stock
export const updateStockTransfer = async (transferId: string, transferData: Partial<StockTransferInput>): Promise<StockTransfer> => {
  return api.patch<StockTransfer>(`${ENDPOINTS.STOCK_TRANSFERS}/${transferId}`, transferData, { requireAuth: true });
};

// Función para eliminar una transferencia de stock
export const deleteStockTransfer = async (transferId: string): Promise<void> => {
  return api.del<void>(`${ENDPOINTS.STOCK_TRANSFERS}/${transferId}`, { requireAuth: true });
};

// Función para obtener los elementos de una transferencia de stock
export const getStockTransferItems = async (transferId: string): Promise<StockTransferItem[]> => {
  return api.get<StockTransferItem[]>(`${ENDPOINTS.STOCK_TRANSFERS}/${transferId}/items`, { requireAuth: true });
};

// Función para agregar un elemento a una transferencia de stock
export const addStockTransferItem = async (itemData: StockTransferItemInput): Promise<StockTransferItem> => {
  return api.post<StockTransferItem>(`${ENDPOINTS.STOCK_TRANSFERS}/${itemData.transfer_id}/items`, itemData, { requireAuth: true });
};

// Función para actualizar un elemento de una transferencia de stock
export const updateStockTransferItem = async (itemId: string, itemData: Partial<StockTransferItemInput>): Promise<StockTransferItem> => {
  return api.patch<StockTransferItem>(`${ENDPOINTS.STOCK_TRANSFERS}/items/${itemId}`, itemData, { requireAuth: true });
};

// Función para eliminar un elemento de una transferencia de stock
export const deleteStockTransferItem = async (itemId: string): Promise<void> => {
  return api.del<void>(`${ENDPOINTS.STOCK_TRANSFERS}/items/${itemId}`, { requireAuth: true });
}; 
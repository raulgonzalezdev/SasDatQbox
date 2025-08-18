// Auth hooks
export { useAuth } from './useAuth';

// Medical hooks
export { useAppointments, type Appointment, type CreateAppointmentPayload, type UpdateAppointmentPayload } from './useAppointments';
export { usePatients, type Patient, type CreatePatientPayload, type UpdatePatientPayload } from './usePatients';

// Business hooks
export { useBusinesses, type Business, type CreateBusinessPayload, type UpdateBusinessPayload } from './useBusinesses';
export { useBusinessLocations, type BusinessLocation, type CreateBusinessLocationPayload, type UpdateBusinessLocationPayload } from './useBusinessLocations';

// Product and Inventory hooks
export { useProducts, type Product, type CreateProductPayload, type UpdateProductPayload } from './useProducts';
export { useInventory, type InventoryItem, type CreateInventoryItemPayload, type UpdateInventoryItemPayload } from './useInventory';

// Customer hooks
export { useCustomers, type Customer, type CreateCustomerPayload, type UpdateCustomerPayload } from './useCustomers';

// Subscription hooks
export { useSubscriptions, type SubscriptionProduct, type SubscriptionPrice, type CreateSubscriptionProductPayload, type CreateSubscriptionPricePayload } from './useSubscriptions';

// Chat hooks
export { useChat, type Conversation, type Message, type CreateConversationPayload, type CreateMessagePayload } from './useChat';

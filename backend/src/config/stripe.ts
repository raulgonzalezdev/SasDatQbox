import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Verificar si las variables tienen valores reales o son placeholders
const isPlaceholder = (value: string) => {
  return value.includes('your_') || value === '';
};

// Cliente mock que no hace nada pero permite que la aplicación se inicie
const mockStripeClient = {
  customers: {
    create: async () => ({ id: 'mock_customer_id' }),
  },
  subscriptions: {
    create: async () => ({ 
      id: 'mock_subscription_id',
      latest_invoice: { payment_intent: { client_secret: 'mock_client_secret' } }
    }),
    cancel: async () => ({}),
    retrieve: async () => ({ metadata: { userId: 'mock_user_id' } }),
  },
  webhooks: {
    constructEvent: () => ({ type: 'mock_event', data: { object: {} } }),
  },
} as any;

let stripe: any;

if (isPlaceholder(STRIPE_SECRET_KEY)) {
  console.error('⚠️ Error de configuración: La variable de entorno STRIPE_SECRET_KEY debe tener un valor real.');
  console.error('Por favor, actualiza el archivo .env con tus credenciales de Stripe.');
  
  // En desarrollo, proporcionamos un cliente mock para evitar que la aplicación se detenga
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Usando cliente Stripe mock para desarrollo. La funcionalidad de pagos será limitada.');
    stripe = mockStripeClient;
  } else {
    // En producción, detenemos la aplicación
    process.exit(1);
  }
} else {
  try {
    // Crear el cliente real de Stripe
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // Usar la versión más reciente de la API
    });
    console.log('✅ Conexión a Stripe establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con Stripe:', error);
    process.exit(1);
  }
}

export { stripe, STRIPE_WEBHOOK_SECRET }; 
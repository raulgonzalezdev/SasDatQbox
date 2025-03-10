import { stripe } from '../config/stripe';
import { supabase } from '../config/supabase';
import { SubscriptionStatus } from '../types/userTypes';

// Precios de los planes
const SUBSCRIPTION_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || 'price_monthly',
  yearly: process.env.STRIPE_PRICE_YEARLY || 'price_yearly'
};

export const createCustomer = async (userId: string, email: string, name: string): Promise<string> => {
  try {
    // Crear cliente en Stripe
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId
      }
    });

    // Actualizar el usuario con el ID del cliente
    const { error } = await supabase
      .from('users')
      .update({
        customerId: customer.id,
        updatedAt: new Date()
      })
      .eq('id', userId);

    if (error) {
      throw new Error('Error al actualizar el usuario con el ID del cliente: ' + error.message);
    }

    return customer.id;
  } catch (error: any) {
    throw new Error('Error al crear el cliente en Stripe: ' + error.message);
  }
};

export const createSubscription = async (
  customerId: string,
  priceId: string,
  userId: string
): Promise<string> => {
  try {
    // Crear suscripción en Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId
      }
    });

    // Actualizar el usuario con el ID de la suscripción
    const { error } = await supabase
      .from('users')
      .update({
        subscriptionId: subscription.id,
        subscriptionStatus: SubscriptionStatus.INACTIVE, // Se actualizará cuando se complete el pago
        updatedAt: new Date()
      })
      .eq('id', userId);

    if (error) {
      throw new Error('Error al actualizar el usuario con el ID de la suscripción: ' + error.message);
    }

    // @ts-ignore - Stripe types are not complete
    const clientSecret = subscription.latest_invoice.payment_intent.client_secret;
    return clientSecret;
  } catch (error: any) {
    throw new Error('Error al crear la suscripción en Stripe: ' + error.message);
  }
};

export const cancelSubscription = async (subscriptionId: string, userId: string): Promise<void> => {
  try {
    // Cancelar suscripción en Stripe
    await stripe.subscriptions.cancel(subscriptionId);

    // Actualizar el usuario
    const { error } = await supabase
      .from('users')
      .update({
        subscriptionStatus: SubscriptionStatus.CANCELLED,
        updatedAt: new Date()
      })
      .eq('id', userId);

    if (error) {
      throw new Error('Error al actualizar el estado de la suscripción del usuario: ' + error.message);
    }
  } catch (error: any) {
    throw new Error('Error al cancelar la suscripción en Stripe: ' + error.message);
  }
};

export const handleWebhookEvent = async (event: any): Promise<void> => {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Evento no manejado: ${event.type}`);
    }
  } catch (error: any) {
    throw new Error('Error al manejar el evento de webhook: ' + error.message);
  }
};

// Funciones auxiliares para manejar eventos de webhook

const handleSubscriptionCreated = async (subscription: any): Promise<void> => {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscriptionId: subscription.id,
      subscriptionStatus: mapStripeStatusToAppStatus(subscription.status),
      updatedAt: new Date()
    })
    .eq('id', userId);
};

const handleSubscriptionUpdated = async (subscription: any): Promise<void> => {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscriptionStatus: mapStripeStatusToAppStatus(subscription.status),
      updatedAt: new Date()
    })
    .eq('id', userId);
};

const handleSubscriptionDeleted = async (subscription: any): Promise<void> => {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscriptionStatus: SubscriptionStatus.CANCELLED,
      updatedAt: new Date()
    })
    .eq('id', userId);
};

const handleInvoicePaymentSucceeded = async (invoice: any): Promise<void> => {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      updatedAt: new Date()
    })
    .eq('id', userId);
};

const handleInvoicePaymentFailed = async (invoice: any): Promise<void> => {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await supabase
    .from('users')
    .update({
      subscriptionStatus: SubscriptionStatus.PAST_DUE,
      updatedAt: new Date()
    })
    .eq('id', userId);
};

// Función para mapear el estado de Stripe al estado de la aplicación
const mapStripeStatusToAppStatus = (stripeStatus: string): SubscriptionStatus => {
  switch (stripeStatus) {
    case 'active':
      return SubscriptionStatus.ACTIVE;
    case 'trialing':
      return SubscriptionStatus.TRIAL;
    case 'past_due':
      return SubscriptionStatus.PAST_DUE;
    case 'canceled':
      return SubscriptionStatus.CANCELLED;
    default:
      return SubscriptionStatus.INACTIVE;
  }
}; 
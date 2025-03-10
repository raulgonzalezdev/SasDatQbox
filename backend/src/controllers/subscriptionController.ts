import { Request, Response } from 'express';
import * as subscriptionService from '../services/subscriptionService';
import { stripe, STRIPE_WEBHOOK_SECRET } from '../config/stripe';

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { priceId } = req.body;
    const userId = req.user.id;
    
    // Validar datos
    if (!priceId) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, proporciona el ID del precio'
      });
    }

    // Verificar si el usuario ya tiene un ID de cliente
    let customerId = req.user.customerId;
    
    // Si no tiene un ID de cliente, crear uno
    if (!customerId) {
      customerId = await subscriptionService.createCustomer(
        userId,
        req.user.email,
        req.user.name
      );
    }

    // Crear suscripción
    const clientSecret = await subscriptionService.createSubscription(
      customerId,
      priceId,
      userId
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        clientSecret
      }
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.user.subscriptionId;
    
    if (!subscriptionId) {
      return res.status(400).json({
        status: 'error',
        message: 'No tienes una suscripción activa'
      });
    }

    await subscriptionService.cancelSubscription(subscriptionId, userId);
    
    res.status(200).json({
      status: 'success',
      message: 'Suscripción cancelada correctamente'
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(400).json({
      status: 'error',
      message: 'Firma de webhook no proporcionada'
    });
  }

  try {
    // Verificar la firma del webhook
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    // Manejar el evento
    await subscriptionService.handleWebhookEvent(event);
    
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error al procesar el webhook:', error.message);
    res.status(400).json({
      status: 'error',
      message: `Error al procesar el webhook: ${error.message}`
    });
  }
}; 
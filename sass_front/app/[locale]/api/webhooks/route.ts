import Stripe from 'stripe';
// import { stripe } from '@/utils/stripe/config'; // Eliminado, ya no se usa

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 });
    // event = stripe.webhooks.constructEvent(body, sig, webhookSecret); // Descomentar y usar la instancia de Stripe si es necesario
    console.log(`🔔  Webhook recibido: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Mensaje de error: ${err.message}`);
    return new Response(`Error de Webhook: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          console.log('Producto creado/actualizado - Llamar endpoint de FastAPI');
          break;
        case 'price.created':
        case 'price.updated':
          console.log('Precio creado/actualizado - Llamar endpoint de FastAPI');
          break;
        case 'price.deleted':
          console.log('Precio eliminado - Llamar endpoint de FastAPI');
          break;
        case 'product.deleted':
          console.log('Producto eliminado - Llamar endpoint de FastAPI');
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          console.log('Cambio de estado de suscripción - Llamar endpoint de FastAPI');
          break;
        case 'checkout.session.completed':
          console.log('Sesión de checkout completada - Llamar endpoint de FastAPI');
          break;
        default:
          throw new Error('Evento relevante no manejado!');
      }
    } catch (error) {
      console.log(error);
      return new Response(
        'Fallo el manejador del Webhook. Revise los logs de su función Next.js.',
        {
          status: 400
        }
      );
    }
  } else {
    return new Response(`Tipo de evento no soportado: ${event.type}`, {
      status: 400
    });
  }
  return new Response(JSON.stringify({ received: true }));
}

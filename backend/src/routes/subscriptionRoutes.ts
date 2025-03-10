import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para webhook (pública)
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.handleWebhook);

// Rutas protegidas
router.use(protect);
router.post('/create', subscriptionController.createSubscription);
router.post('/cancel', subscriptionController.cancelSubscription);

export default router; 
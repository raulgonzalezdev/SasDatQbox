import { Router } from 'express';
import * as userController from '../controllers/userController';
// import { authenticate } from '../middleware/auth'; // Middleware de autenticación (a implementar)

const router = Router();

// Rutas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas
// router.get('/profile', authenticate, userController.getProfile);
// router.put('/profile', authenticate, userController.updateProfile);

export default router; 
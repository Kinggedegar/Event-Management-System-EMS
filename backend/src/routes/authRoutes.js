// src/routes/authRoutes.js
import { Router } from 'express';
import authController from '../controllers/authController.js';
import { validate, schemas } from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.js';
import userController from '../controllers/userController.js';

const router = Router();

router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, validate(schemas.updateProfile), userController.updateProfile);
router.put('/password', authMiddleware, validate(schemas.changePassword), userController.changePassword);

export default router;

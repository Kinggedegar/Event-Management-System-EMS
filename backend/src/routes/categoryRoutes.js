// src/routes/categoryRoutes.js
import { Router } from 'express';
import categoryController from '../controllers/categoryController.js';
import authMiddleware from '../middleware/auth.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = Router();

router.get('/', categoryController.list);
// Allow public creation of categories (free creation)
router.post('/', categoryController.create);
router.put('/:id', authMiddleware, requireAdmin, categoryController.update);
router.delete('/:id', authMiddleware, requireAdmin, categoryController.remove);

export default router;

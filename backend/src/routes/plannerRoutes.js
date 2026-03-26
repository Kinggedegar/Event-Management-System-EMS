import { Router } from 'express';
import plannerController from '../controllers/plannerController.js';

const router = Router();

// Public: list recommended planners
router.get('/', plannerController.listRecommended);

// Public: get a planner profile by id
router.get('/:id', plannerController.getProfile);

export default router;

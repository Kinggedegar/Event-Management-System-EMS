import { Router } from 'express'
import authMiddleware from '../middleware/auth.js'
import registrationController from '../controllers/registrationController.js'

const router = Router()

router.post('/', authMiddleware, (req, res, next) => registrationController.create(req, res, next))
router.get('/my', authMiddleware, (req, res, next) => registrationController.myRegistrations(req, res, next))
router.get('/:id', authMiddleware, (req, res, next) => registrationController.get(req, res, next))

export default router

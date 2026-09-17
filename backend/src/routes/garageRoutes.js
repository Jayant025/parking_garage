import express from 'express';
import { garageController } from '../controllers/garageController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, garageController.getAll);
router.get('/:id', authenticate, garageController.getById);
router.post('/', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), garageController.create);
router.patch('/:id', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), garageController.update);

export default router;

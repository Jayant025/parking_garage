import express from 'express';
import { spotController } from '../controllers/spotController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, spotController.getSpots);
router.get('/availability', authenticate, spotController.getAvailability);
router.post('/', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), spotController.createSpot);
router.patch('/:id/status', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), spotController.updateStatus);

export default router;

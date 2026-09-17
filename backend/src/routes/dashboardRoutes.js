import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), dashboardController.getSummary);
router.get('/', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), dashboardController.getSummary);

export default router;

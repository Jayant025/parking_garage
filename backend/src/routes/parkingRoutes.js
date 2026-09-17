import express from 'express';
import { parkingController } from '../controllers/parkingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/check-in', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), parkingController.checkIn);
router.post('/check-out', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), parkingController.checkOut);
router.get('/history', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), parkingController.getHistory);

export default router;

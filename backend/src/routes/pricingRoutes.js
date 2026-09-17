import express from 'express';
import { pricingController } from '../controllers/pricingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, pricingController.getPricing);
router.put('/', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), pricingController.updatePricing);
router.post('/', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), pricingController.updatePricing);

export default router;

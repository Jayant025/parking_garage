import express from 'express';
import { pricingController } from '../controllers/pricingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, pricingController.getPricing);
router.put('/', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), pricingController.updatePricing);
router.post('/', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), pricingController.updatePricing);

// T4 Rate Card Import & Cleaning Endpoints (Operator protected)
router.post('/parse-rate-card', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), pricingController.parseRateCard);
router.post('/import-rate-card', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), pricingController.importRateCard);

export default router;

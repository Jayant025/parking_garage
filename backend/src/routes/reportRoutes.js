import express from 'express';
import { reportController } from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), reportController.getReportData);

export default router;

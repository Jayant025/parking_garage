import express from 'express';
import { supportController } from '../controllers/supportController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer endpoints
router.post('/', authenticate, supportController.createTicket);
router.get('/my-tickets', authenticate, supportController.getMyTickets);

// Operator endpoints (protected: 403 for CUSTOMER)
router.get('/admin', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), supportController.getAllTickets);
router.patch('/admin/:id/status', authenticate, authorize('OPERATOR', 'ADMIN', 'ATTENDANT'), supportController.updateStatus);

export default router;

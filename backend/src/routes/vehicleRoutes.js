import express from 'express';
import { parkingController } from '../controllers/parkingController.js';

const router = express.Router();

router.get('/search', parkingController.searchVehicle);
router.get('/search/:plate', parkingController.searchVehicle);

export default router;

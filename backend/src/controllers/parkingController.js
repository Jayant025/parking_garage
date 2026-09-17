import { parkingService } from '../services/parkingService.js';

export const parkingController = {
  checkIn: async (req, res, next) => {
    try {
      const result = await parkingService.checkIn(req.body);
      return res.status(201).json({
        success: true,
        session: result.session,
        assignedSpot: {
          spotNumber: result.assignedSpot.spotNumber,
          level: result.assignedSpot.level,
          sector: result.assignedSpot.sector || 'Sector A',
          type: result.assignedSpot.type,
          hasEvCharger: result.assignedSpot.hasEvCharger || false,
          chargerPowerKw: result.assignedSpot.chargerPowerKw,
        },
        receiptNumber: result.receiptNumber,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  checkOut: async (req, res, next) => {
    try {
      const result = await parkingService.checkOut(req.body);
      return res.status(200).json({
        success: true,
        session: result.session,
        receiptNumber: result.receiptNumber,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  searchVehicle: async (req, res, next) => {
    try {
      const plate = req.query.plate || req.params.plate || '';
      const result = await parkingService.searchVehicle(plate);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getHistory: async (req, res, next) => {
    try {
      const result = await parkingService.getHistory(req.query);
      return res.status(200).json({
        success: true,
        data: result.sessions,
        sessions: result.sessions,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  },
};

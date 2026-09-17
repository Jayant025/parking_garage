import { spotService } from '../services/spotService.js';

export const spotController = {
  getSpots: async (req, res, next) => {
    try {
      const spots = await spotService.getSpots(req.query);
      return res.status(200).json({
        success: true,
        data: spots,
      });
    } catch (error) {
      next(error);
    }
  },

  getAvailability: async (req, res, next) => {
    try {
      const type = req.query.type || 'EV';
      const availability = await spotService.getAvailability(type);
      return res.status(200).json({
        success: true,
        data: availability,
      });
    } catch (error) {
      next(error);
    }
  },

  createSpot: async (req, res, next) => {
    try {
      const spot = await spotService.createSpot(req.body);
      return res.status(201).json({
        success: true,
        data: spot,
      });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const updated = await spotService.updateStatus(req.params.id, req.body.status);
      return res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};

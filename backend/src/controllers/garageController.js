import { garageService } from '../services/garageService.js';

export const garageController = {
  getAll: async (req, res, next) => {
    try {
      const garages = await garageService.getAll();
      return res.status(200).json({
        success: true,
        data: garages,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const garage = await garageService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: garage,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const created = await garageService.create(req.body);
      return res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await garageService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};

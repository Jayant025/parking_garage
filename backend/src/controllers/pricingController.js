import { pricingService } from '../services/pricingService.js';

export const pricingController = {
  getPricing: async (req, res, next) => {
    try {
      const pricing = await pricingService.getPricing(req.query.garageId);
      return res.status(200).json({
        success: true,
        data: pricing,
      });
    } catch (error) {
      next(error);
    }
  },

  updatePricing: async (req, res, next) => {
    try {
      const tiers = req.body.tiers || req.body;
      const updated = await pricingService.updatePricing(Array.isArray(tiers) ? tiers : [tiers]);
      return res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};

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

  parseRateCard: async (req, res, next) => {
    try {
      const rawData = req.body.rawData || req.body.rateCard || req.body;
      const result = await pricingService.parseRateCard(rawData);
      return res.status(200).json({
        success: result.success,
        data: result.cleanedTiers,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  },

  importRateCard: async (req, res, next) => {
    try {
      const rawData = req.body.rawData || req.body.rateCard || req.body.tiers || req.body;
      const result = await pricingService.importRateCard(rawData);
      return res.status(200).json({
        success: true,
        data: result.cleanedTiers,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};

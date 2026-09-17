import { dashboardService } from '../services/dashboardService.js';

export const dashboardController = {
  getSummary: async (req, res, next) => {
    try {
      const summary = await dashboardService.getSummary();
      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  },
};

import { reportService } from '../services/reportService.js';

export const reportController = {
  getReportData: async (req, res, next) => {
    try {
      const data = await reportService.getReportData();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

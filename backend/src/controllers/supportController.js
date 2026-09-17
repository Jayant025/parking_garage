import { SupportTicket } from '../models/SupportTicket.js';

export const supportController = {
  // Customer: Create a support ticket
  createTicket: async (req, res, next) => {
    try {
      const { subject, category, message } = req.body;
      if (!subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Subject and message are required.',
        });
      }

      const ticket = await SupportTicket.create({
        user: req.user.id,
        name: req.user.name || 'Customer',
        email: req.user.email || 'customer@parkflow.io',
        subject: subject.trim(),
        category: category || 'GENERAL',
        message: message.trim(),
        status: 'OPEN',
      });

      return res.status(201).json({
        success: true,
        data: ticket,
        message: 'Support request submitted successfully.',
      });
    } catch (error) {
      next(error);
    }
  },

  // Customer: View my support tickets
  getMyTickets: async (req, res, next) => {
    try {
      const tickets = await SupportTicket.find({ user: req.user.id })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  },

  // Operator: View all support tickets
  getAllTickets: async (req, res, next) => {
    try {
      const { status, search } = req.query;
      const query = {};

      if (status && status !== 'ALL') {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { subject: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
        ];
      }

      const tickets = await SupportTicket.find(query)
        .populate('user', 'name email badgeNumber role')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  },

  // Operator: Update support ticket status
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value.',
        });
      }

      const ticket = await SupportTicket.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Support ticket not found.',
        });
      }

      return res.status(200).json({
        success: true,
        data: ticket,
        message: `Ticket status updated to ${status}.`,
      });
    } catch (error) {
      next(error);
    }
  },
};

import { Garage } from '../models/Garage.js';

export const garageService = {
  getAll: async () => {
    return Garage.find({ activeStatus: true }).sort({ createdAt: -1 });
  },

  getById: async (id) => {
    const garage = await Garage.findById(id);
    if (!garage) {
      const err = new Error('Garage facility not found.');
      err.statusCode = 404;
      throw err;
    }
    return garage;
  },

  create: async (data) => {
    const code = (data.code || data.name).replace(/\s+/g, '_').toUpperCase();
    return Garage.create({
      ...data,
      code,
    });
  },

  update: async (id, data) => {
    const updated = await Garage.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      const err = new Error('Garage facility not found.');
      err.statusCode = 404;
      throw err;
    }
    return updated;
  },
};

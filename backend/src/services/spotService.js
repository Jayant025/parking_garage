import { ParkingSpot } from '../models/ParkingSpot.js';
import { Garage } from '../models/Garage.js';

export const spotService = {
  getSpots: async ({ level, type, status, garageId }) => {
    const query = {};

    if (garageId) {
      query.garage = garageId;
    }

    if (level && level !== 'all') {
      query.level = { $regex: level, $options: 'i' };
    }

    if (type && type !== 'all') {
      query.type = type.toUpperCase();
    }

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }

    return ParkingSpot.find(query).sort({ level: 1, spotNumber: 1 });
  },

  getAvailability: async (type = 'EV') => {
    const upperType = type.toUpperCase();
    const total = await ParkingSpot.countDocuments({ type: upperType });
    const occupied = await ParkingSpot.countDocuments({ type: upperType, status: 'OCCUPIED' });
    const available = total - occupied;

    return {
      total,
      occupied,
      available,
      availability: available > 0,
    };
  },

  createSpot: async (spotData) => {
    const garage = await Garage.findOne({ activeStatus: true });
    if (!garage) {
      const err = new Error('No active garage facility found.');
      err.statusCode = 404;
      throw err;
    }

    return ParkingSpot.create({
      garage: garage._id,
      ...spotData,
      spotNumber: spotData.spotNumber.toUpperCase(),
      type: spotData.type.toUpperCase(),
    });
  },

  updateStatus: async (spotId, status) => {
    const updated = await ParkingSpot.findByIdAndUpdate(
      spotId,
      { status: status.toUpperCase() },
      { new: true }
    );
    if (!updated) {
      const err = new Error('Spot not found.');
      err.statusCode = 404;
      throw err;
    }
    return updated;
  },
};

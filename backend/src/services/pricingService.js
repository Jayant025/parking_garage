import { Pricing } from '../models/Pricing.js';
import { Garage } from '../models/Garage.js';

export const pricingService = {
  getPricing: async (garageId) => {
    let query = {};
    if (garageId) {
      query.garage = garageId;
    } else {
      const defaultGarage = await Garage.findOne({ activeStatus: true });
      if (defaultGarage) {
        query.garage = defaultGarage._id;
      }
    }
    return Pricing.find(query);
  },

  updatePricing: async (tiersData) => {
    const defaultGarage = await Garage.findOne({ activeStatus: true });
    if (!defaultGarage) {
      const err = new Error('No active garage facility found to set pricing.');
      err.statusCode = 404;
      throw err;
    }

    const updatedTiers = [];
    for (const tier of tiersData) {
      const upperType = (tier.vehicleType || tier.type).toUpperCase();
      const updated = await Pricing.findOneAndUpdate(
        { garage: defaultGarage._id, vehicleType: upperType },
        {
          $set: {
            firstHourRate: tier.firstHourRate,
            additionalHourRate: tier.additionalHourRate,
            dailyMaxCap: tier.dailyMaxCap,
            evFeePerHour: tier.evFeePerHour || 0,
          },
        },
        { new: true, upsert: true }
      );
      updatedTiers.push(updated);
    }

    return updatedTiers;
  },
};

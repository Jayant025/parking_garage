import { Pricing } from '../models/Pricing.js';
import { Garage } from '../models/Garage.js';
import { ParkingSpot } from '../models/ParkingSpot.js';
import { cleanAndValidateRateCard } from '../utils/rateCardCleaner.js';

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
            name: tier.name || `${upperType} Rate Tier`,
            firstHourRate: tier.firstHourRate,
            additionalHourRate: tier.additionalHourRate,
            dailyMaxCap: tier.dailyMaxCap,
            evFeePerHour: tier.evFeePerHour || 0,
          },
        },
        { new: true, upsert: true }
      );
      updatedTiers.push(updated);

      // Sync spot hourlyRate with firstHourRate
      await ParkingSpot.updateMany(
        { garage: defaultGarage._id, type: upperType },
        { $set: { hourlyRate: tier.firstHourRate } }
      );
    }

    return updatedTiers;
  },

  parseRateCard: async (rawData) => {
    return cleanAndValidateRateCard(rawData);
  },

  importRateCard: async (rawData) => {
    const result = cleanAndValidateRateCard(rawData);

    if (!result.success || result.cleanedTiers.length === 0) {
      const err = new Error(
        result.errors.length > 0
          ? result.errors.join(' | ')
          : 'Failed to clean and validate rate card data.'
      );
      err.statusCode = 400;
      err.errors = result.errors;
      throw err;
    }

    // Atomically save cleaned rates to MongoDB
    const updatedTiers = await pricingService.updatePricing(result.cleanedTiers);

    return {
      message: `Successfully cleaned and imported ${result.cleanedTiers.length} rate tier(s) to MongoDB Atlas.`,
      cleanedTiers: updatedTiers,
    };
  },
};

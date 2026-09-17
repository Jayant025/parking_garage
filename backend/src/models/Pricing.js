import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema(
  {
    garage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Garage',
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ['COMPACT', 'STANDARD', 'EV'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    firstHourRate: {
      type: Number,
      required: true,
      min: 0,
    },
    additionalHourRate: {
      type: Number,
      required: true,
      min: 0,
    },
    dailyMaxCap: {
      type: Number,
      required: true,
      min: 0,
    },
    evFeePerHour: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

pricingSchema.index({ garage: 1, vehicleType: 1 }, { unique: true });

export const Pricing = mongoose.model('Pricing', pricingSchema);

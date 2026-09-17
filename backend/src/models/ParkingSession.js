import mongoose from 'mongoose';

const parkingSessionSchema = new mongoose.Schema(
  {
    garage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Garage',
      required: true,
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    spot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSpot',
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    vehicleType: {
      type: String,
      enum: ['COMPACT', 'STANDARD', 'EV'],
      required: true,
    },
    spotNumber: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      default: 'Sector A',
    },
    entryTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    exitTime: {
      type: Date,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    chargedHours: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED'],
      default: 'ACTIVE',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CARD', 'APP', 'PASS'],
    },
    pricingSnapshot: {
      firstHourRate: Number,
      additionalHourRate: Number,
      dailyMaxCap: Number,
      subtotal: Number,
      taxAmount: Number,
      totalFee: Number,
    },
  },
  {
    timestamps: true,
  }
);

parkingSessionSchema.index({ licensePlate: 1, status: 1 });

export const ParkingSession = mongoose.model('ParkingSession', parkingSessionSchema);

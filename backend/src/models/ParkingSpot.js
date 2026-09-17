import mongoose from 'mongoose';

const parkingSpotSchema = new mongoose.Schema(
  {
    garage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Garage',
      required: true,
      index: true,
    },
    level: {
      type: String,
      required: true,
      trim: true,
    },
    sector: {
      type: String,
      default: 'Sector A',
      trim: true,
    },
    spotNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['COMPACT', 'STANDARD', 'EV'],
      required: true,
      default: 'STANDARD',
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'OCCUPIED', 'DISABLED'],
      default: 'AVAILABLE',
      index: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      default: 10,
    },
    hasEvCharger: {
      type: Boolean,
      default: false,
    },
    chargerPowerKw: {
      type: Number,
      default: 0,
    },
    currentVehiclePlate: {
      type: String,
      uppercase: true,
      trim: true,
    },
    entryTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness of spotNumber within a garage & level
parkingSpotSchema.index({ garage: 1, level: 1, spotNumber: 1 }, { unique: true });
parkingSpotSchema.index({ garage: 1, type: 1, status: 1 });

export const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

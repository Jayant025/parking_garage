import mongoose from 'mongoose';

const garageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    levels: {
      type: [String],
      default: ['Level 1', 'Level 2', 'Level 3'],
    },
    totalCapacity: {
      type: Number,
      default: 250,
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Garage = mongoose.model('Garage', garageSchema);

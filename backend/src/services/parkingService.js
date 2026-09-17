import mongoose from 'mongoose';
import { ParkingSession } from '../models/ParkingSession.js';
import { ParkingSpot } from '../models/ParkingSpot.js';
import { Vehicle } from '../models/Vehicle.js';
import { Garage } from '../models/Garage.js';
import { Pricing } from '../models/Pricing.js';
import { billingService } from './billingService.js';
import { normalizePlate } from '../utils/plateNormalizer.js';

export const parkingService = {
  // Vehicle Check-In Logic
  checkIn: async ({ plateNumber, vehicleType, overrideSpotId, garageId }) => {
    const cleanPlate = normalizePlate(plateNumber);
    const upperType = vehicleType.toUpperCase();

    if (!cleanPlate) {
      const err = new Error('Valid license plate number is required.');
      err.statusCode = 400;
      err.code = 'INVALID_PLATE';
      throw err;
    }

    // Find default garage if not specified
    let garage = null;
    if (garageId) {
      garage = await Garage.findById(garageId);
    } else {
      garage = await Garage.findOne({ activeStatus: true });
    }

    if (!garage) {
      const err = new Error('No active parking garage facility found in MongoDB.');
      err.statusCode = 404;
      err.code = 'GARAGE_NOT_FOUND';
      throw err;
    }

    // 1. Prevent duplicate active parking for the same vehicle
    const existingActiveSession = await ParkingSession.findOne({
      licensePlate: cleanPlate,
      status: 'ACTIVE',
    });

    if (existingActiveSession) {
      const err = new Error(`Vehicle "${cleanPlate}" already has an ACTIVE parking session in Bay ${existingActiveSession.spotNumber}.`);
      err.statusCode = 409;
      err.code = 'VEHICLE_ALREADY_PARKED';
      throw err;
    }

    // 2. Find or create Vehicle document
    let vehicle = await Vehicle.findOne({ plateNumber: cleanPlate });
    if (!vehicle) {
      vehicle = await Vehicle.create({
        plateNumber: cleanPlate,
        vehicleType: upperType,
      });
    }

    // 3. Find compatible available spot
    let targetSpot = null;

    if (overrideSpotId) {
      targetSpot = await ParkingSpot.findOne({
        _id: overrideSpotId,
        garage: garage._id,
        status: 'AVAILABLE',
      });
      if (!targetSpot) {
        const err = new Error('Selected override parking spot is unavailable or occupied.');
        err.statusCode = 409;
        err.code = 'SPOT_UNAVAILABLE';
        throw err;
      }
    } else {
      // Automatic allocation strategy
      if (upperType === 'EV') {
        // MANDATORY EV RULE: EV vehicles MUST ONLY be assigned EV spots!
        targetSpot = await ParkingSpot.findOne({
          garage: garage._id,
          type: 'EV',
          status: 'AVAILABLE',
        });

        if (!targetSpot) {
          const err = new Error('No EV parking spot available in the garage.');
          err.statusCode = 409;
          err.code = 'NO_EV_SPOT';
          throw err;
        }
      } else {
        // Non-EV vehicles: assign matching type or STANDARD
        targetSpot = await ParkingSpot.findOne({
          garage: garage._id,
          type: { $in: [upperType, 'STANDARD'] },
          status: 'AVAILABLE',
        });

        if (!targetSpot) {
          // Fallback to any available spot
          targetSpot = await ParkingSpot.findOne({
            garage: garage._id,
            status: 'AVAILABLE',
          });
        }
      }
    }

    if (!targetSpot) {
      const err = new Error('Garage is currently at 100% full capacity.');
      err.statusCode = 409;
      err.code = 'GARAGE_FULL';
      throw err;
    }

    // 4. Atomically reserve spot to prevent double-parking race conditions
    const updatedSpot = await ParkingSpot.findOneAndUpdate(
      { _id: targetSpot._id, status: 'AVAILABLE' },
      {
        $set: {
          status: 'OCCUPIED',
          currentVehiclePlate: cleanPlate,
          entryTime: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedSpot) {
      const err = new Error('Spot allocation collision. Spot was reserved by another vehicle.');
      err.statusCode = 409;
      err.code = 'CONCURRENCY_COLLISION';
      throw err;
    }

    // 5. Create ParkingSession in MongoDB
    const session = await ParkingSession.create({
      garage: garage._id,
      vehicle: vehicle._id,
      spot: updatedSpot._id,
      licensePlate: cleanPlate,
      vehicleType: upperType,
      spotNumber: updatedSpot.spotNumber,
      level: updatedSpot.level,
      sector: updatedSpot.sector,
      entryTime: new Date(),
      status: 'ACTIVE',
    });

    return {
      success: true,
      session,
      assignedSpot: updatedSpot,
      receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      message: `Vehicle ${cleanPlate} successfully checked in to Bay ${updatedSpot.spotNumber}.`,
    };
  },

  // Vehicle Check-Out & Billing Logic
  checkOut: async ({ plateNumber, paymentMethod = 'CARD' }) => {
    const cleanPlate = normalizePlate(plateNumber);

    if (!cleanPlate) {
      const err = new Error('Valid license plate number is required.');
      err.statusCode = 400;
      err.code = 'INVALID_PLATE';
      throw err;
    }

    // 1. Find active parking session in MongoDB
    const session = await ParkingSession.findOne({
      licensePlate: cleanPlate,
      status: 'ACTIVE',
    });

    if (!session) {
      const err = new Error(`No active parking session found for license plate "${cleanPlate}".`);
      err.statusCode = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    // 2. Fetch Pricing configuration from MongoDB
    const pricingConfig = await Pricing.findOne({
      garage: session.garage,
      vehicleType: session.vehicleType,
    });

    // 3. Calculate fee on backend
    const exitTime = new Date();
    const feeData = billingService.calculateFee(session.entryTime, exitTime, pricingConfig);

    // 4. Update session to COMPLETED
    session.exitTime = exitTime;
    session.durationMinutes = feeData.durationMinutes;
    session.chargedHours = feeData.chargedHours;
    session.amount = feeData.totalFee;
    session.status = 'COMPLETED';
    session.paymentMethod = paymentMethod.toUpperCase();
    session.pricingSnapshot = {
      firstHourRate: feeData.firstHourRate,
      additionalHourRate: feeData.additionalHourRate,
      dailyMaxCap: feeData.dailyMaxCap,
      subtotal: feeData.subtotal,
      taxAmount: feeData.taxAmount,
      totalFee: feeData.totalFee,
    };

    await session.save();

    // 5. Release parking spot back to AVAILABLE
    await ParkingSpot.findByIdAndUpdate(session.spot, {
      $set: {
        status: 'AVAILABLE',
      },
      $unset: {
        currentVehiclePlate: 1,
        entryTime: 1,
      },
    });

    return {
      success: true,
      session,
      receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      message: `Check-out completed for ${cleanPlate}. Bay ${session.spotNumber} released.`,
    };
  },

  // Search active vehicle session
  searchVehicle: async (plate) => {
    const cleanPlate = normalizePlate(plate);
    if (!cleanPlate) return null;

    const session = await ParkingSession.findOne({
      licensePlate: { $regex: cleanPlate, $options: 'i' },
      status: 'ACTIVE',
    });

    if (!session) return null;

    // Calculate current preview fee
    const pricingConfig = await Pricing.findOne({
      garage: session.garage,
      vehicleType: session.vehicleType,
    });
    const feeData = billingService.calculateFee(session.entryTime, new Date(), pricingConfig);

    return {
      ...session.toObject(),
      feeBreakdown: feeData,
    };
  },

  // Parking History with server-side pagination & filtering
  getHistory: async ({ page = 1, limit = 20, search = '', status = 'all' }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const query = {};

    if (search && search.trim() !== '') {
      const clean = normalizePlate(search);
      query.$or = [
        { licensePlate: { $regex: clean, $options: 'i' } },
        { spotNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }

    const total = await ParkingSession.countDocuments(query);
    const sessions = await ParkingSession.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return {
      sessions,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    };
  },
};

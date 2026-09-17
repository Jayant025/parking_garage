import dotenv from 'dotenv';
dotenv.config({ override: true });
import bcrypt from 'bcryptjs';
import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Garage } from '../models/Garage.js';
import { ParkingSpot } from '../models/ParkingSpot.js';
import { Pricing } from '../models/Pricing.js';
import { Vehicle } from '../models/Vehicle.js';
import { ParkingSession } from '../models/ParkingSession.js';

const seedDatabase = async () => {
  console.log('[Seed] Connecting to MongoDB...');
  await connectDB();

  console.log('[Seed] Clearing existing collections...');
  await User.deleteMany({});
  await Garage.deleteMany({});
  await ParkingSpot.deleteMany({});
  await Pricing.deleteMany({});
  await Vehicle.deleteMany({});
  await ParkingSession.deleteMany({});

  // 1. Seed Users (Operator & Customer)
  console.log('[Seed] Creating operator & customer accounts...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const operatorUser = await User.create({
    name: 'ParkFlow Operator',
    email: 'admin@parkflow.io',
    passwordHash,
    role: 'OPERATOR',
    badgeNumber: '#1001',
  });

  const customerUser = await User.create({
    name: 'Rahul Sharma',
    email: 'customer@parkflow.io',
    passwordHash,
    role: 'CUSTOMER',
    badgeNumber: '#8892',
  });

  // 2. Seed Garage Facility
  console.log('[Seed] Creating default Garage facility...');
  const garage = await Garage.create({
    name: 'Downtown Central Station',
    code: 'DOWNTOWN_CENTRAL',
    address: '401 Commerce St, Metro Core',
    levels: ['Level 1', 'Level 2', 'Level 3'],
    totalCapacity: 250,
    activeStatus: true,
  });

  // 3. Seed Pricing Tiers (INR rates)
  console.log('[Seed] Configuring Pricing Tiers (INR)...');
  await Pricing.create([
    {
      garage: garage._id,
      vehicleType: 'COMPACT',
      name: 'Compact Sedan / Mini',
      firstHourRate: 50,
      additionalHourRate: 30,
      dailyMaxCap: 300,
    },
    {
      garage: garage._id,
      vehicleType: 'STANDARD',
      name: 'Standard SUV / Truck',
      firstHourRate: 80,
      additionalHourRate: 40,
      dailyMaxCap: 500,
    },
    {
      garage: garage._id,
      vehicleType: 'EV',
      name: 'EV Fast Bay (Level 2 22kW)',
      firstHourRate: 100,
      additionalHourRate: 50,
      dailyMaxCap: 600,
      evFeePerHour: 20,
    },
  ]);

  // 4. Seed Parking Spots
  console.log('[Seed] Creating parking spots across levels...');
  const spotsData = [
    // Level 1
    { garage: garage._id, level: 'Level 1', sector: 'Sector A', spotNumber: 'C01', type: 'COMPACT', status: 'AVAILABLE', hourlyRate: 50, hasEvCharger: false },
    { garage: garage._id, level: 'Level 1', sector: 'Sector A', spotNumber: 'C02', type: 'COMPACT', status: 'OCCUPIED', hourlyRate: 50, hasEvCharger: false, currentVehiclePlate: 'MH12AB1234', entryTime: new Date(Date.now() - 2.25 * 3600 * 1000) },
    { garage: garage._id, level: 'Level 1', sector: 'Sector A', spotNumber: 'S01', type: 'STANDARD', status: 'OCCUPIED', hourlyRate: 80, hasEvCharger: false, currentVehiclePlate: 'DL01CX9988', entryTime: new Date(Date.now() - 4 * 3600 * 1000) },
    { garage: garage._id, level: 'Level 1', sector: 'Sector A', spotNumber: 'S02', type: 'STANDARD', status: 'AVAILABLE', hourlyRate: 80, hasEvCharger: false },
    { garage: garage._id, level: 'Level 1', sector: 'Sector B', spotNumber: 'E01', type: 'EV', status: 'AVAILABLE', hourlyRate: 100, hasEvCharger: true, chargerPowerKw: 22 },
    { garage: garage._id, level: 'Level 1', sector: 'Sector B', spotNumber: 'E02', type: 'EV', status: 'OCCUPIED', hourlyRate: 100, hasEvCharger: true, chargerPowerKw: 22, currentVehiclePlate: 'KA03EV3021', entryTime: new Date(Date.now() - 1.2 * 3600 * 1000) },
    { garage: garage._id, level: 'Level 1', sector: 'Sector B', spotNumber: 'B01', type: 'STANDARD', status: 'OCCUPIED', hourlyRate: 80, hasEvCharger: false, currentVehiclePlate: 'KA01MH5544', entryTime: new Date(Date.now() - 0.7 * 3600 * 1000) },
    { garage: garage._id, level: 'Level 1', sector: 'Sector B', spotNumber: 'B02', type: 'STANDARD', status: 'OCCUPIED', hourlyRate: 80, hasEvCharger: false, currentVehiclePlate: 'GJ01PA1112', entryTime: new Date(Date.now() - 5.3 * 3600 * 1000) },

    // Level 2
    { garage: garage._id, level: 'Level 2', sector: 'Sector A', spotNumber: 'C-108', type: 'COMPACT', status: 'AVAILABLE', hourlyRate: 50, hasEvCharger: false },
    { garage: garage._id, level: 'Level 2', sector: 'Sector B', spotNumber: 'E-204', type: 'EV', status: 'AVAILABLE', hourlyRate: 100, hasEvCharger: true, chargerPowerKw: 22 },
    { garage: garage._id, level: 'Level 2', sector: 'Sector C', spotNumber: 'S-210', type: 'STANDARD', status: 'AVAILABLE', hourlyRate: 80, hasEvCharger: false },
    { garage: garage._id, level: 'Level 2', sector: 'Sector B', spotNumber: 'E-208', type: 'EV', status: 'OCCUPIED', hourlyRate: 100, hasEvCharger: true, chargerPowerKw: 22, currentVehiclePlate: 'TN07BT8120', entryTime: new Date(Date.now() - 3.6 * 3600 * 1000) },

    // Level 3
    { garage: garage._id, level: 'Level 3', sector: 'Sector C', spotNumber: 'S-312', type: 'STANDARD', status: 'AVAILABLE', hourlyRate: 80, hasEvCharger: false },
    { garage: garage._id, level: 'Level 3', sector: 'Sector A', spotNumber: 'C-302', type: 'COMPACT', status: 'AVAILABLE', hourlyRate: 50, hasEvCharger: false },
  ];

  const createdSpots = await ParkingSpot.create(spotsData);

  // 5. Seed Initial Active Sessions
  console.log('[Seed] Creating initial active sessions...');
  const occupiedSpots = createdSpots.filter((s) => s.status === 'OCCUPIED');

  for (const spot of occupiedSpots) {
    let veh = await Vehicle.findOne({ plateNumber: spot.currentVehiclePlate });
    if (!veh) {
      veh = await Vehicle.create({
        plateNumber: spot.currentVehiclePlate,
        vehicleType: spot.type,
      });
    }

    await ParkingSession.create({
      garage: garage._id,
      vehicle: veh._id,
      spot: spot._id,
      licensePlate: spot.currentVehiclePlate,
      vehicleType: spot.type,
      spotNumber: spot.spotNumber,
      level: spot.level,
      sector: spot.sector,
      entryTime: spot.entryTime || new Date(),
      status: 'ACTIVE',
    });
  }

  console.log('[Seed] Database seeding completed successfully!');
  console.log(`[Seed] Operator Account: admin@parkflow.io / password123`);
  console.log(`[Seed] Customer Account: customer@parkflow.io / password123`);

  await closeDB();
};

seedDatabase().catch((err) => {
  console.error('[Seed Error]', err);
  process.exit(1);
});

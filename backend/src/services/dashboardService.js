import { ParkingSpot } from '../models/ParkingSpot.js';
import { ParkingSession } from '../models/ParkingSession.js';
import { Garage } from '../models/Garage.js';

export const dashboardService = {
  getSummary: async () => {
    const garage = await Garage.findOne({ activeStatus: true });
    const garageId = garage?._id;

    const query = garageId ? { garage: garageId } : {};

    const totalCapacity = await ParkingSpot.countDocuments(query);
    const occupiedSpots = await ParkingSpot.countDocuments({ ...query, status: 'OCCUPIED' });
    const availableSpots = totalCapacity - occupiedSpots;
    const occupancyPercentage = totalCapacity > 0 ? Math.round((occupiedSpots / totalCapacity) * 1000) / 10 : 0;

    const evPortsTotal = await ParkingSpot.countDocuments({ ...query, type: 'EV' });
    const evPortsAvailable = await ParkingSpot.countDocuments({ ...query, type: 'EV', status: 'AVAILABLE' });
    const evPortsCharging = evPortsTotal - evPortsAvailable;

    // Turnover today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const turnoverToday = await ParkingSession.countDocuments({
      ...query,
      entryTime: { $gte: startOfDay },
    });

    // Net revenue today
    const completedToday = await ParkingSession.find({
      ...query,
      status: 'COMPLETED',
      exitTime: { $gte: startOfDay },
    });

    const netRevenueToday = completedToday.reduce((sum, s) => sum + (s.amount || 0), 0);
    const avgRevenuePerTicket = completedToday.length > 0 ? Math.round((netRevenueToday / completedToday.length) * 100) / 100 : 0;

    // Floor occupancy aggregation
    const levels = garage?.levels || ['Level 1', 'Level 2', 'Level 3'];
    const floorOccupancy = [];

    for (const lvl of levels) {
      const lvlTotal = await ParkingSpot.countDocuments({ ...query, level: lvl });
      const lvlOccupied = await ParkingSpot.countDocuments({ ...query, level: lvl, status: 'OCCUPIED' });
      const pct = lvlTotal > 0 ? Math.round((lvlOccupied / lvlTotal) * 1000) / 10 : 0;
      floorOccupancy.push({
        level: lvl,
        occupied: lvlOccupied,
        total: lvlTotal,
        percentage: pct,
      });
    }

    // Recent Activity feed from database
    const recentSessions = await ParkingSession.find(query)
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentActivity = recentSessions.map((s) => ({
      id: s._id.toString(),
      licensePlate: s.licensePlate,
      spotNumber: s.spotNumber,
      level: s.level,
      type: s.status === 'ACTIVE' ? 'check_in' : 'check_out',
      timestamp: new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: s.status === 'ACTIVE' ? 'Parked' : 'Departed',
    }));

    return {
      totalCapacity,
      availableSpots,
      occupiedSpots,
      occupancyPercentage,
      availableRatePerHour: 12,
      evPortsAvailable,
      evPortsTotal,
      evPortsCharging,
      turnoverToday,
      netRevenueToday: Math.round(netRevenueToday * 100) / 100,
      avgRevenuePerTicket,
      revenueChangePercent: 8.4,
      floorOccupancy,
      recentActivity,
    };
  },
};

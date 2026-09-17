export type VehicleType = 'compact' | 'standard' | 'ev';

export type SpotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface ParkingSpot {
  id: string;
  spotNumber: string;
  level: string; // e.g. "Level 1", "L1"
  sector: string; // e.g. "Sector A"
  type: VehicleType;
  status: SpotStatus;
  hourlyRate: number;
  hasEvCharger: boolean;
  chargerPowerKw?: number;
  currentVehiclePlate?: string;
  parkedDuration?: string;
  entryTime?: string;
}

export type SessionStatus = 'active' | 'completed' | 'overstay';

export type PaymentMethod = 'cash' | 'card' | 'app' | 'pass';

export interface FeeBreakdown {
  firstHourRate: number;
  additionalHourRate: number;
  billedHours: number;
  actualDurationMinutes: number;
  subtotal: number;
  taxAmount: number;
  dailyMaxCap: number;
  capStatus: 'Not Exceeded' | 'Cap Applied';
  totalFee: number;
}

export interface ParkingSession {
  id: string;
  licensePlate: string;
  vehicleType: VehicleType;
  spotId: string;
  spotNumber: string;
  level: string;
  sector: string;
  entryTime: string;
  exitTime?: string;
  durationMinutes: number;
  formattedDuration: string;
  feeBreakdown?: FeeBreakdown;
  status: SessionStatus;
  paymentMethod?: PaymentMethod;
}

export interface CheckInRequest {
  licensePlate: string;
  vehicleType: VehicleType;
  overrideSpotId?: string;
}

export interface CheckInResponse {
  success: boolean;
  session: ParkingSession;
  assignedSpot: ParkingSpot;
  receiptNumber: string;
  message: string;
}

export interface CheckOutRequest {
  licensePlate: string;
  paymentMethod: PaymentMethod;
}

export interface CheckOutResponse {
  success: boolean;
  session: ParkingSession;
  receiptNumber: string;
  message: string;
}

export interface RecentActivityItem {
  id: string;
  licensePlate: string;
  spotNumber: string;
  level: string;
  type: 'check_in' | 'check_out';
  timestamp: string;
  status: 'Parked' | 'Departed';
}

export interface FloorOccupancy {
  level: string;
  occupied: number;
  total: number;
  percentage: number;
}

export interface DashboardMetrics {
  totalCapacity: number;
  availableSpots: number;
  occupiedSpots: number;
  occupancyPercentage: number;
  availableRatePerHour: number;
  evPortsAvailable: number;
  evPortsTotal: number;
  evPortsCharging: number;
  turnoverToday: number;
  netRevenueToday: number;
  avgRevenuePerTicket: number;
  revenueChangePercent: number;
  floorOccupancy: FloorOccupancy[];
  recentActivity: RecentActivityItem[];
}

export interface RevenueDataPoint {
  hour: string;
  revenue: number;
  occupancy: number;
}

export interface SpotTypeDistribution {
  name: string;
  count: number;
  value: number;
}

export interface ReportData {
  revenueTrend: RevenueDataPoint[];
  typeDistribution: SpotTypeDistribution[];
  occupancyByHour: { hour: string; compact: number; standard: number; ev: number }[];
  summary: {
    totalSessions: number;
    totalRevenue: number;
    avgDurationMinutes: number;
    peakOccupancyTime: string;
  };
}

export interface PricingTier {
  id: string;
  vehicleType: VehicleType;
  name: string;
  firstHourRate: number;
  additionalHourRate: number;
  dailyMaxCap: number;
  evFeePerHour: number;
}

export interface Garage {
  id: string;
  name: string;
  code: string;
  address: string;
  levels: string[];
  totalCapacity: number;
  activeStatus: boolean;
  apiStatus: string;
  latencyMs: number;
}

export type TicketCategory = 'BILLING' | 'PARKING_ISSUE' | 'TECHNICAL' | 'GENERAL';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface SupportTicket {
  _id: string;
  user: string | { _id: string; name: string; email: string; badgeNumber?: string; role?: string };
  name: string;
  email: string;
  subject: string;
  category: TicketCategory;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  badgeNumber: string;
  email: string;
  role: 'operator' | 'manager' | 'admin' | 'attendant' | 'customer' | 'user';
  avatarUrl?: string;
}

import { apiClient } from './apiClient';
import {
  DashboardMetrics,
  ParkingSpot,
  ParkingSession,
  CheckInRequest,
  CheckInResponse,
  CheckOutRequest,
  CheckOutResponse,
  Garage,
  PricingTier,
  ReportData,
  VehicleType,
  SupportTicket,
  TicketCategory,
  TicketStatus,
} from '../types';

export const parkingService = {
  // GET /api/dashboard/summary
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await apiClient.get<{ success: boolean; data: DashboardMetrics }>('/dashboard/summary');
    return res.data.data;
  },

  // GET /api/spots
  getSpots: async (level?: string, type?: VehicleType): Promise<ParkingSpot[]> => {
    const res = await apiClient.get<{ success: boolean; data: ParkingSpot[] }>('/spots', {
      params: { level, type },
    });
    return res.data.data.map((spot: any) => ({
      id: spot._id || spot.id,
      spotNumber: spot.spotNumber,
      level: spot.level,
      sector: spot.sector || 'Sector A',
      type: (spot.type || 'STANDARD').toLowerCase() as VehicleType,
      status: (spot.status || 'AVAILABLE').toLowerCase() as any,
      hourlyRate: spot.hourlyRate || 50,
      hasEvCharger: spot.hasEvCharger || false,
      chargerPowerKw: spot.chargerPowerKw,
      currentVehiclePlate: spot.currentVehiclePlate,
      parkedDuration: spot.entryTime
        ? `${Math.max(1, Math.round((Date.now() - new Date(spot.entryTime).getTime()) / (1000 * 60)))} mins`
        : undefined,
    }));
  },

  // GET /api/spots/availability (For vacant spots list)
  getAvailableSpots: async (): Promise<ParkingSpot[]> => {
    const res = await apiClient.get<{ success: boolean; data: ParkingSpot[] }>('/spots/availability');
    return res.data.data.map((spot: any) => ({
      id: spot._id || spot.id,
      spotNumber: spot.spotNumber,
      level: spot.level,
      sector: spot.sector || 'Sector A',
      type: (spot.type || 'STANDARD').toLowerCase() as VehicleType,
      status: 'available',
      hourlyRate: spot.hourlyRate || 50,
      hasEvCharger: spot.hasEvCharger || false,
      chargerPowerKw: spot.chargerPowerKw,
    }));
  },

  // POST /api/parking/check-in
  checkInVehicle: async (req: CheckInRequest): Promise<CheckInResponse> => {
    const res = await apiClient.post<any>('/parking/check-in', {
      plateNumber: req.licensePlate,
      vehicleType: req.vehicleType,
      overrideSpotId: req.overrideSpotId,
    });
    const d = res.data;
    const s = d.session || d.data;
    return {
      success: d.success,
      receiptNumber: d.receiptNumber,
      message: d.message,
      session: {
        id: s._id || s.id,
        licensePlate: s.licensePlate,
        vehicleType: (s.vehicleType || 'STANDARD').toLowerCase() as VehicleType,
        spotId: s.spot,
        spotNumber: s.spotNumber,
        level: s.level,
        sector: s.sector || 'Sector A',
        entryTime: s.entryTime,
        durationMinutes: 0,
        formattedDuration: 'Just Now',
        status: 'active',
      },
      assignedSpot: d.assignedSpot ? {
        id: d.assignedSpot._id || d.assignedSpot.id || '',
        spotNumber: d.assignedSpot.spotNumber,
        level: d.assignedSpot.level,
        sector: d.assignedSpot.sector || 'Sector A',
        type: (d.assignedSpot.type || 'standard').toLowerCase() as VehicleType,
        status: 'occupied',
        hourlyRate: d.assignedSpot.hourlyRate || 50,
        hasEvCharger: d.assignedSpot.hasEvCharger || false,
        chargerPowerKw: d.assignedSpot.chargerPowerKw,
      } : {} as any,
    };
  },

  // POST /api/parking/check-out
  checkOutVehicle: async (req: CheckOutRequest): Promise<CheckOutResponse> => {
    const res = await apiClient.post<any>('/parking/check-out', {
      plateNumber: req.licensePlate,
      paymentMethod: req.paymentMethod,
    });
    const d = res.data;
    const s = d.session || d.data;
    return {
      success: d.success,
      receiptNumber: d.receiptNumber,
      message: d.message,
      session: {
        id: s._id || s.id,
        licensePlate: s.licensePlate,
        vehicleType: (s.vehicleType || 'STANDARD').toLowerCase() as VehicleType,
        spotId: s.spot,
        spotNumber: s.spotNumber,
        level: s.level,
        sector: s.sector || 'Sector A',
        entryTime: s.entryTime,
        exitTime: s.exitTime,
        durationMinutes: s.durationMinutes || 0,
        formattedDuration: s.durationMinutes
          ? `${Math.floor(s.durationMinutes / 60)}h ${s.durationMinutes % 60}m`
          : '0h 0m',
        status: 'completed',
        paymentMethod: (s.paymentMethod || req.paymentMethod).toLowerCase() as any,
        feeBreakdown: s.pricingSnapshot ? {
          firstHourRate: s.pricingSnapshot.firstHourRate,
          additionalHourRate: s.pricingSnapshot.additionalHourRate,
          billedHours: s.chargedHours || 1,
          actualDurationMinutes: s.durationMinutes || 0,
          subtotal: s.pricingSnapshot.subtotal,
          taxAmount: s.pricingSnapshot.taxAmount,
          dailyMaxCap: s.pricingSnapshot.dailyMaxCap,
          capStatus: 'Not Exceeded' as const,
          totalFee: s.amount || s.pricingSnapshot.totalFee,
        } : undefined,
      },
    };
  },

  // GET /api/vehicles/search?plate=...
  searchVehicle: async (plate: string): Promise<ParkingSession | null> => {
    if (!plate || !plate.trim()) return null;
    const res = await apiClient.get<{ success: boolean; data: any }>(`/vehicles/search`, {
      params: { plate: plate.trim() },
    });
    if (!res.data.data) return null;
    const s = res.data.data;
    return {
      id: s._id || s.id,
      licensePlate: s.licensePlate,
      vehicleType: (s.vehicleType || 'STANDARD').toLowerCase() as VehicleType,
      spotId: s.spot,
      spotNumber: s.spotNumber,
      level: s.level,
      sector: s.sector || 'Sector A',
      entryTime: s.entryTime,
      durationMinutes: s.feeBreakdown?.durationMinutes || 0,
      formattedDuration: s.feeBreakdown?.durationMinutes
        ? `${Math.floor(s.feeBreakdown.durationMinutes / 60)}h ${s.feeBreakdown.durationMinutes % 60}m`
        : 'Active',
      status: (s.status || 'ACTIVE').toLowerCase() as any,
      feeBreakdown: s.feeBreakdown
        ? {
            firstHourRate: s.feeBreakdown.firstHourRate,
            additionalHourRate: s.feeBreakdown.additionalHourRate,
            billedHours: s.feeBreakdown.chargedHours,
            actualDurationMinutes: s.feeBreakdown.durationMinutes,
            subtotal: s.feeBreakdown.subtotal,
            taxAmount: s.feeBreakdown.taxAmount,
            dailyMaxCap: s.feeBreakdown.dailyMaxCap,
            capStatus: (s.feeBreakdown.capStatus || 'Not Exceeded') as 'Not Exceeded' | 'Cap Applied',
            totalFee: s.feeBreakdown.totalFee,
          }
        : undefined,
    };
  },

  // GET /api/parking/history
  getHistory: async (params?: { page?: number; search?: string; status?: string }): Promise<{ sessions: ParkingSession[]; total: number }> => {
    const res = await apiClient.get<{ success: boolean; sessions: any[]; total: number }>('/parking/history', { params });
    const sessions = (res.data.sessions || []).map((s: any) => ({
      id: s._id || s.id,
      licensePlate: s.licensePlate,
      vehicleType: (s.vehicleType || 'STANDARD').toLowerCase() as VehicleType,
      spotId: s.spot,
      spotNumber: s.spotNumber,
      level: s.level,
      sector: s.sector || 'Sector A',
      entryTime: s.entryTime,
      exitTime: s.exitTime,
      durationMinutes: s.durationMinutes || 0,
      formattedDuration: s.durationMinutes
        ? `${Math.floor(s.durationMinutes / 60)}h ${s.durationMinutes % 60}m`
        : 'Active',
      status: (s.status || 'ACTIVE').toLowerCase() as any,
      paymentMethod: s.paymentMethod ? s.paymentMethod.toLowerCase() : undefined,
      feeBreakdown: s.pricingSnapshot
        ? {
            firstHourRate: s.pricingSnapshot.firstHourRate,
            additionalHourRate: s.pricingSnapshot.additionalHourRate,
            billedHours: s.chargedHours || 1,
            actualDurationMinutes: s.durationMinutes || 0,
            subtotal: s.pricingSnapshot.subtotal,
            taxAmount: s.pricingSnapshot.taxAmount,
            dailyMaxCap: s.pricingSnapshot.dailyMaxCap,
            capStatus: (s.pricingSnapshot.capStatus || 'Not Exceeded') as 'Not Exceeded' | 'Cap Applied',
            totalFee: s.amount || s.pricingSnapshot.totalFee,
          }
        : undefined,
    }));
    return { sessions, total: res.data.total || sessions.length };
  },

  // GET /api/pricing & PUT /api/pricing
  getPricing: async (): Promise<PricingTier[]> => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>('/pricing');
    return (res.data.data || []).map((t: any) => ({
      id: t._id || t.id,
      vehicleType: (t.vehicleType || 'STANDARD').toLowerCase() as VehicleType,
      name: t.name || `${t.vehicleType} Rate Tier`,
      firstHourRate: t.firstHourRate,
      additionalHourRate: t.additionalHourRate,
      dailyMaxCap: t.dailyMaxCap,
      evFeePerHour: t.evFeePerHour || 0,
    }));
  },

  updatePricing: async (tiers: PricingTier[]): Promise<PricingTier[]> => {
    const res = await apiClient.put<{ success: boolean; data: any[] }>('/pricing', { tiers });
    return (res.data.data || []).map((t: any) => ({
      id: t._id || t.id,
      vehicleType: (t.vehicleType || 'STANDARD').toLowerCase() as VehicleType,
      name: t.name || `${t.vehicleType} Rate Tier`,
      firstHourRate: t.firstHourRate,
      additionalHourRate: t.additionalHourRate,
      dailyMaxCap: t.dailyMaxCap,
      evFeePerHour: t.evFeePerHour || 0,
    }));
  },

  // T4: Parse Messy Rate Card
  parseRateCard: async (rawData: any): Promise<{ success: boolean; data: PricingTier[]; errors: string[] }> => {
    const res = await apiClient.post<{ success: boolean; data: any[]; errors: string[] }>('/pricing/parse-rate-card', { rawData });
    const cleaned = (res.data.data || []).map((t: any) => ({
      id: t._id || t.id || t.vehicleType,
      vehicleType: (t.vehicleType || 'STANDARD').toLowerCase() as VehicleType,
      name: t.name || `${t.vehicleType} Rate Tier`,
      firstHourRate: t.firstHourRate,
      additionalHourRate: t.additionalHourRate,
      dailyMaxCap: t.dailyMaxCap,
      evFeePerHour: t.evFeePerHour || 0,
    }));
    return { success: res.data.success, data: cleaned, errors: res.data.errors || [] };
  },

  // T4: Import Cleaned Rate Card to MongoDB
  importRateCard: async (rawData: any): Promise<{ success: boolean; data: PricingTier[]; message: string }> => {
    const res = await apiClient.post<{ success: boolean; data: any[]; message: string }>('/pricing/import-rate-card', { rawData });
    const cleaned = (res.data.data || []).map((t: any) => ({
      id: t._id || t.id || t.vehicleType,
      vehicleType: (t.vehicleType || 'STANDARD').toLowerCase() as VehicleType,
      name: t.name || `${t.vehicleType} Rate Tier`,
      firstHourRate: t.firstHourRate,
      additionalHourRate: t.additionalHourRate,
      dailyMaxCap: t.dailyMaxCap,
      evFeePerHour: t.evFeePerHour || 0,
    }));
    return { success: res.data.success, data: cleaned, message: res.data.message };
  },

  // GET /api/garages
  getGarages: async (): Promise<Garage[]> => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>('/garages');
    return (res.data.data || []).map((g: any) => ({
      id: g._id || g.id,
      name: g.name,
      code: g.code,
      address: g.address,
      levels: g.levels || ['Level 1', 'Level 2', 'Level 3'],
      totalCapacity: g.totalCapacity || 250,
      activeStatus: g.activeStatus,
      apiStatus: '200 OK',
      latencyMs: 18,
    }));
  },

  // GET /api/reports
  getReports: async (): Promise<ReportData> => {
    const res = await apiClient.get<{ success: boolean; data: ReportData }>('/reports');
    return res.data.data;
  },

  // --- Support Ticket APIs ---
  createSupportTicket: async (ticket: { subject: string; category: TicketCategory; message: string }): Promise<SupportTicket> => {
    const res = await apiClient.post<{ success: boolean; data: SupportTicket }>('/support', ticket);
    return res.data.data;
  },

  getMySupportTickets: async (): Promise<SupportTicket[]> => {
    const res = await apiClient.get<{ success: boolean; data: SupportTicket[] }>('/support/my-tickets');
    return res.data.data;
  },

  getAdminSupportTickets: async (status?: string, search?: string): Promise<SupportTicket[]> => {
    const res = await apiClient.get<{ success: boolean; data: SupportTicket[] }>('/support/admin', {
      params: { status, search },
    });
    return res.data.data;
  },

  updateTicketStatus: async (id: string, status: TicketStatus): Promise<SupportTicket> => {
    const res = await apiClient.patch<{ success: boolean; data: SupportTicket }>(`/support/admin/${id}/status`, { status });
    return res.data.data;
  },

  // --- Password Reset APIs ---
  forgotPassword: async (email: string): Promise<{ message: string; resetToken?: string }> => {
    const res = await apiClient.post<{ success: boolean; data: { message: string; resetToken?: string } }>('/auth/forgot-password', { email });
    return res.data.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const res = await apiClient.post<{ success: boolean; data: { message: string } }>('/auth/reset-password', { token, newPassword });
    return res.data.data;
  },
};

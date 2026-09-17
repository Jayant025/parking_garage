import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parkingService } from '../services/parkingService';
import { CheckInRequest, CheckOutRequest, PricingTier, VehicleType } from '../types';

export const QUERY_KEYS = {
  dashboard: ['dashboard'],
  spots: (level?: string, type?: VehicleType) => ['spots', level, type],
  vehicleSearch: (plate: string) => ['vehicleSearch', plate],
  history: (search?: string, status?: string) => ['history', search, status],
  pricing: ['pricing'],
  garages: ['garages'],
  reports: ['reports'],
};

// Hook for Dashboard Metrics
export function useDashboardData() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: () => parkingService.getDashboardMetrics(),
    refetchInterval: 15000, // Background sync every 15s
  });
}

// Hook for Parking Spots Grid
export function useSpotsData(level?: string, type?: VehicleType) {
  return useQuery({
    queryKey: QUERY_KEYS.spots(level, type),
    queryFn: () => parkingService.getSpots(level, type),
  });
}

// Hook for Check-In Mutation
export function useCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: CheckInRequest) => parkingService.checkInVehicle(req),
    onSuccess: () => {
      // Invalidate queries so UI updates automatically across all components
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

// Hook for Check-Out Mutation
export function useCheckOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: CheckOutRequest) => parkingService.checkOutVehicle(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['vehicleSearch'] });
    },
  });
}

// Hook for Vehicle Search
export function useVehicleSearch(plate: string) {
  return useQuery({
    queryKey: QUERY_KEYS.vehicleSearch(plate),
    queryFn: () => parkingService.searchVehicle(plate),
    enabled: plate.trim().length >= 2,
  });
}

// Hook for History Table
export function useParkingHistory(search?: string, status?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.history(search, status),
    queryFn: () => parkingService.getHistory({ search, status }),
  });
}

// Hook for Pricing
export function usePricingData() {
  return useQuery({
    queryKey: QUERY_KEYS.pricing,
    queryFn: () => parkingService.getPricing(),
  });
}

// Hook for Pricing Mutation
export function useUpdatePricingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tiers: PricingTier[]) => parkingService.updatePricing(tiers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pricing });
    },
  });
}

// Hook for Garages List
export function useGaragesData() {
  return useQuery({
    queryKey: QUERY_KEYS.garages,
    queryFn: () => parkingService.getGarages(),
  });
}

// Hook for Reports Data
export function useReportsData() {
  return useQuery({
    queryKey: QUERY_KEYS.reports,
    queryFn: () => parkingService.getReports(),
  });
}

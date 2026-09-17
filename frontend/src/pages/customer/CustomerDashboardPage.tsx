import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../../services/parkingService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: availableSpots = [], isLoading: isLoadingSpots } = useQuery({
    queryKey: ['customerAvailableSpots'],
    queryFn: () => parkingService.getAvailableSpots(),
  });

  const { data: pricingTiers = [], isLoading: isLoadingPricing } = useQuery({
    queryKey: ['customerPricing'],
    queryFn: () => parkingService.getPricing(),
  });

  const evSpotsCount = availableSpots.filter((s) => s.hasEvCharger).length;

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-secondary text-on-primary p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 bg-on-primary/10 rounded-full text-xs font-semibold tracking-wider uppercase border border-on-primary/20">
            Welcome to ParkFlow
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Hello, {user?.name || 'Valued Customer'}!
          </h1>
          <p className="text-sm opacity-90 leading-relaxed">
            Find real-time available parking spots, check hourly pricing rates in ₹, and contact customer support directly from your portal.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/customer/spots"
              className="px-5 py-2.5 bg-on-primary text-primary font-bold text-sm rounded-xl shadow hover:bg-on-primary/90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">local_parking</span>
              <span>Find Parking Spot</span>
            </Link>
            <Link
              to="/customer/support"
              className="px-5 py-2.5 bg-on-primary/20 hover:bg-on-primary/30 text-on-primary font-semibold text-sm rounded-xl transition-all flex items-center gap-2 border border-on-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span>Get Support</span>
            </Link>
          </div>
        </div>

        {/* Decorative BG Icon */}
        <span className="material-symbols-outlined text-[160px] absolute -right-6 -bottom-10 opacity-15 pointer-events-none select-none">
          local_parking
        </span>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Vacant Spots Now
            </span>
            {isLoadingSpots ? (
              <LoadingSkeleton count={1} height="h-8" />
            ) : (
              <p className="text-2xl font-bold text-primary mt-1">{availableSpots.length}</p>
            )}
            <span className="text-[11px] text-on-surface-variant mt-0.5 block">
              Live from MongoDB
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">directions_car</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              EV Charging Bays
            </span>
            {isLoadingSpots ? (
              <LoadingSkeleton count={1} height="h-8" />
            ) : (
              <p className="text-2xl font-bold text-secondary mt-1">{evSpotsCount}</p>
            )}
            <span className="text-[11px] text-on-surface-variant mt-0.5 block">
              Level 2 22kW Available
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">ev_station</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Starting Rate
            </span>
            {isLoadingPricing ? (
              <LoadingSkeleton count={1} height="h-8" />
            ) : (
              <p className="text-2xl font-bold text-on-surface mt-1">
                {pricingTiers.length > 0
                  ? formatCurrency(Math.min(...pricingTiers.map((t) => t.firstHourRate)))
                  : formatCurrency(50)}
              </p>
            )}
            <span className="text-[11px] text-on-surface-variant mt-0.5 block">
              Per first hour (INR)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">payments</span>
          </div>
        </div>
      </div>

      {/* Available Spots Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">grid_view</span>
            <span>Available Parking Spots</span>
          </h2>
          <Link to="/customer/spots" className="text-xs font-semibold text-primary hover:underline">
            View All ({availableSpots.length}) →
          </Link>
        </div>

        {isLoadingSpots ? (
          <LoadingSkeleton count={3} height="h-20" />
        ) : availableSpots.length === 0 ? (
          <div className="p-8 text-center bg-surface-container rounded-2xl border border-outline-variant/30 space-y-2">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant">no_photography</span>
            <p className="font-semibold text-on-surface">No vacant parking spots currently available</p>
            <p className="text-xs text-on-surface-variant">Please check back shortly as parked vehicles depart.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableSpots.slice(0, 6).map((spot) => (
              <div
                key={spot.id}
                className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-on-surface">
                    {spot.spotNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary/15 text-secondary">
                    Available
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>{spot.level}</span>
                  <span className="capitalize font-medium">{spot.type}</span>
                </div>

                {spot.hasEvCharger && (
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-secondary">
                    <span className="material-symbols-outlined text-[16px]">ev_station</span>
                    <span>EV Charger ({spot.chargerPowerKw || 22} kW)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Tiers Quick Overview */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">sell</span>
            <span>Parking Rates Summary (INR)</span>
          </h2>
          <Link to="/customer/pricing" className="text-xs font-semibold text-primary hover:underline">
            Full Pricing Schedule →
          </Link>
        </div>

        {isLoadingPricing ? (
          <LoadingSkeleton count={3} height="h-20" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface uppercase">{tier.vehicleType}</span>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                    Standard Rate
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">First Hour:</span>
                    <span className="font-bold text-on-surface">{formatCurrency(tier.firstHourRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Add'l Hour:</span>
                    <span className="font-semibold text-on-surface">{formatCurrency(tier.additionalHourRate)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-outline-variant/20">
                    <span className="text-on-surface-variant">Daily Max:</span>
                    <span className="font-bold text-primary">{formatCurrency(tier.dailyMaxCap)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

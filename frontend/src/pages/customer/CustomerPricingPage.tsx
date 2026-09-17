import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../../services/parkingService';
import { formatCurrency } from '../../utils/currency';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export const CustomerPricingPage: React.FC = () => {
  const { data: pricingTiers = [], isLoading } = useQuery({
    queryKey: ['customerPricingSchedule'],
    queryFn: () => parkingService.getPricing(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">payments</span>
          <span>Parking Fee Schedule (INR)</span>
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Official hourly and daily parking rates configured for Downtown Central Station
        </p>
      </div>

      {/* Pricing Tiers Schedule */}
      {isLoading ? (
        <LoadingSkeleton count={3} height="h-48" />
      ) : pricingTiers.length === 0 ? (
        <div className="p-12 text-center bg-surface-container rounded-3xl border border-outline-variant/30 space-y-2">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant">sell</span>
          <p className="font-bold text-on-surface">No pricing schedule available</p>
          <p className="text-xs text-on-surface-variant">Please contact the operator facility manager.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col justify-between space-y-6 shadow-sm"
            >
              <div className="space-y-4">
                {/* Header Badge & Name */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    {tier.vehicleType}
                  </span>
                  {tier.vehicleType === 'ev' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-secondary">
                      <span className="material-symbols-outlined text-[18px]">ev_station</span>
                      <span>EV Charging</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-on-surface">{tier.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {tier.vehicleType === 'compact' && 'Sedans, hatchbacks & mini cars'}
                    {tier.vehicleType === 'standard' && 'SUVs, trucks & full-size sedans'}
                    {tier.vehicleType === 'ev' && 'Includes 22kW charging port access'}
                  </p>
                </div>

                {/* Primary Fee Highlight */}
                <div className="p-4 rounded-2xl bg-surface-container-highest/60 text-center space-y-0.5">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                    First Hour Rate
                  </span>
                  <p className="text-3xl font-extrabold text-primary">
                    {formatCurrency(tier.firstHourRate)}
                  </p>
                </div>

                {/* Rates List */}
                <div className="space-y-3 text-xs pt-2">
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                    <span className="text-on-surface-variant font-medium">Each Additional Hour</span>
                    <span className="font-bold text-on-surface text-sm">
                      {formatCurrency(tier.additionalHourRate)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                    <span className="text-on-surface-variant font-medium">24-Hour Daily Maximum</span>
                    <span className="font-bold text-primary text-sm">
                      {formatCurrency(tier.dailyMaxCap)}
                    </span>
                  </div>

                  {tier.evFeePerHour > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/20 text-secondary">
                      <span className="font-medium">EV Charger Surcharge</span>
                      <span className="font-bold text-sm">
                        {formatCurrency(tier.evFeePerHour)}/hr
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-2 text-[11px] text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Rates include taxes and garage access.</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Banner */}
      <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[24px] mt-0.5">info</span>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-on-surface">Need Help with Billing or Receipts?</h4>
          <p className="text-on-surface-variant leading-relaxed">
            Fees are automatically computed upon vehicle check-out based on exact entry timestamp. For invoice queries or billing assistance, submit a ticket via our{' '}
            <a href="/customer/support" className="text-primary font-semibold hover:underline">
              Customer Support portal
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

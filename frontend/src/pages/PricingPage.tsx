import React, { useState, useEffect } from 'react';
import { usePricingData, useUpdatePricingMutation } from '../hooks/useParkingQueries';
import { PricingTier } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

export const PricingPage: React.FC = () => {
  const { data: pricingData, isLoading } = usePricingData();
  const updateMutation = useUpdatePricingMutation();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (pricingData) {
      setTiers(pricingData);
    }
  }, [pricingData]);

  const handleChange = (id: string, field: keyof PricingTier, value: number) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = () => {
    updateMutation.mutate(tiers, {
      onSuccess: () => {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      },
    });
  };

  if (isLoading) return <LoadingSkeleton count={3} height="h-40" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            Rate Tier & Pricing Configuration (INR)
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Set base hourly fees in ₹, additional rates & daily cap thresholds
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[28px]">payments</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl font-body-sm text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Pricing configuration saved successfully to backend.</span>
        </div>
      )}

      {/* Tiers List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-title-sm text-title-sm font-bold text-on-surface">{tier.name}</h3>
              <Badge variant="ev">{tier.vehicleType.toUpperCase()}</Badge>
            </div>

            <div className="space-y-3">
              <Input
                label="First Hour Rate (₹)"
                type="number"
                value={tier.firstHourRate}
                onChange={(e) => handleChange(tier.id, 'firstHourRate', parseFloat(e.target.value) || 0)}
              />
              <Input
                label="Additional Hour Rate (₹)"
                type="number"
                value={tier.additionalHourRate}
                onChange={(e) => handleChange(tier.id, 'additionalHourRate', parseFloat(e.target.value) || 0)}
              />
              <Input
                label="Daily Maximum Cap (₹)"
                type="number"
                value={tier.dailyMaxCap}
                onChange={(e) => handleChange(tier.id, 'dailyMaxCap', parseFloat(e.target.value) || 0)}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button size="lg" className="px-8 shadow-md" isLoading={updateMutation.isPending} onClick={handleSave}>
          <span className="material-symbols-outlined text-[20px] mr-2">save</span>
          Save Rate Configurations
        </Button>
      </div>
    </div>
  );
};

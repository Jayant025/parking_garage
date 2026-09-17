import React, { useState } from 'react';
import { useCheckInMutation, useSpotsData } from '../hooks/useParkingQueries';
import { VehicleType, CheckInResponse } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';

export const CheckInPage: React.FC = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('ev');
  const [overrideSpotId, setOverrideSpotId] = useState<string | undefined>(undefined);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [receiptResult, setReceiptResult] = useState<CheckInResponse | null>(null);

  const checkInMutation = useCheckInMutation();
  const { data: spots } = useSpotsData();

  // Find preview spot
  const availableSpots = spots?.filter((s) => s.status === 'available') || [];
  const compatibleSpots = availableSpots.filter((s) => {
    if (vehicleType === 'ev') return s.type === 'ev';
    return s.type === vehicleType || s.type === 'standard';
  });

  const previewSpot = overrideSpotId
    ? spots?.find((s) => s.id === overrideSpotId)
    : compatibleSpots[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim()) return;

    checkInMutation.mutate(
      {
        licensePlate: licensePlate.trim(),
        vehicleType,
        overrideSpotId,
      },
      {
        onSuccess: (res) => {
          setReceiptResult(res);
          setLicensePlate('');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">Vehicle Check-In Workflow</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Automated LPR scanner & compatible bay allocation
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[28px]">login</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: LPR & Classification */}
        <Card className="p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-[12px] font-bold">
              1
            </span>
            <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
              License Plate & Vehicle Type
            </h3>
          </div>

          {/* License Plate Input */}
          <div className="space-y-1">
            <Input
              isPlateInput
              label="License Plate Number (LPR Scan / Manual)"
              placeholder="E.G. 7XYZ901"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              required
            />
          </div>

          {/* Vehicle Classification Radio Buttons */}
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
              Vehicle Classification & Rate Tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Compact */}
              <button
                type="button"
                onClick={() => {
                  setVehicleType('compact');
                  setOverrideSpotId(undefined);
                }}
                className={`flex flex-col p-3 rounded-xl text-left border transition-all ${
                  vehicleType === 'compact'
                    ? 'bg-primary-container text-on-primary-container border-primary shadow-md'
                    : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="material-symbols-outlined text-[20px]">directions_car</span>
                  <span className="font-label-caps text-[10px] font-bold">$8/h</span>
                </div>
                <span className="font-title-sm text-[13px] font-bold leading-tight">Compact</span>
                <span className="font-body-sm text-[10px] opacity-80 mt-0.5">Sedans/Minis</span>
              </button>

              {/* Standard */}
              <button
                type="button"
                onClick={() => {
                  setVehicleType('standard');
                  setOverrideSpotId(undefined);
                }}
                className={`flex flex-col p-3 rounded-xl text-left border transition-all ${
                  vehicleType === 'standard'
                    ? 'bg-primary-container text-on-primary-container border-primary shadow-md'
                    : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="material-symbols-outlined text-[20px]">airport_shuttle</span>
                  <span className="font-label-caps text-[10px] font-bold">$10/h</span>
                </div>
                <span className="font-title-sm text-[13px] font-bold leading-tight">Standard</span>
                <span className="font-body-sm text-[10px] opacity-80 mt-0.5">SUVs/Trucks</span>
              </button>

              {/* EV */}
              <button
                type="button"
                onClick={() => {
                  setVehicleType('ev');
                  setOverrideSpotId(undefined);
                }}
                className={`flex flex-col p-3 rounded-xl text-left border transition-all ${
                  vehicleType === 'ev'
                    ? 'bg-primary-container text-on-primary-container border-primary shadow-md'
                    : 'bg-surface-container-low text-on-surface border-outline-variant/40 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  <span className="font-label-caps text-[10px] font-bold">$12/h</span>
                </div>
                <span className="font-title-sm text-[13px] font-bold leading-tight">EV Fast Bay</span>
                <span className="font-body-sm text-[10px] opacity-80 mt-0.5">22kW Charging</span>
              </button>
            </div>
          </div>

          {/* EV Allocation Notice */}
          {vehicleType === 'ev' && (
            <div className="bg-primary-fixed text-on-primary-fixed p-3.5 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[22px] shrink-0">
                electric_bolt
              </span>
              <div className="flex flex-col text-left text-[12px]">
                <span className="font-title-sm font-bold text-primary">EV Allocation Rule Active</span>
                <p className="font-body-sm leading-tight text-on-surface-variant mt-0.5">
                  EV vehicles are strictly assigned to Level 2 dedicated bays with Level-2 22kW connectors.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Step 2: Auto-Assigned Bay Preview */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-[12px] font-bold">
                2
              </span>
              <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
                Auto-Assigned Bay Preview
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOverrideOpen(true)}
              className="text-primary hover:underline font-label-caps text-[11px] uppercase flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Manual Override
            </button>
          </div>

          {previewSpot ? (
            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl font-code-plate text-headline-md tracking-wider font-bold shadow-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                    <span>{previewSpot.spotNumber}</span>
                  </div>
                  <div>
                    <div className="font-title-sm text-title-sm font-bold text-on-surface">
                      {previewSpot.level} · {previewSpot.sector}
                    </div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        near_me
                      </span>
                      <span>Rate: ${previewSpot.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>
                {previewSpot.hasEvCharger && (
                  <Badge variant="ev">
                    <span className="material-symbols-outlined text-[12px]">bolt</span>
                    {previewSpot.chargerPowerKw || 22} kW Ready
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-error-container/30 text-error rounded-xl font-body-sm text-[13px] text-center">
              No compatible available spots found for {vehicleType.toUpperCase()}.
            </div>
          )}
        </Card>

        {/* Error Alert */}
        {checkInMutation.isError && (
          <div className="p-4 bg-error-container text-on-error-container rounded-xl font-body-sm text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{checkInMutation.error.message}</span>
          </div>
        )}

        {/* Submit Action */}
        <Button
          type="submit"
          size="lg"
          className="w-full text-headline-md h-14 shadow-lg gap-2"
          isLoading={checkInMutation.isPending}
          disabled={!previewSpot}
        >
          <span className="material-symbols-outlined text-[24px]">check_circle</span>
          Confirm Check-In & Issue Receipt
        </Button>
      </form>

      {/* Manual Spot Override Modal */}
      <Modal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        title="Override Parking Spot"
      >
        <div className="space-y-3">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Select any compatible available bay to override auto-allocation:
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {compatibleSpots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => {
                  setOverrideSpotId(spot.id);
                  setIsOverrideOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                  overrideSpotId === spot.id
                    ? 'bg-primary-container text-on-primary-container border-primary'
                    : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <span className="font-code-plate text-[14px] font-bold">{spot.spotNumber}</span>
                <span className="font-body-sm text-[12px]">{spot.level} · {spot.sector}</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Check-In Success Receipt Modal */}
      <Modal
        isOpen={!!receiptResult}
        onClose={() => setReceiptResult(null)}
        title="Check-In Confirmation Receipt"
      >
        {receiptResult && (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>

            <div>
              <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">
                Receipt #{receiptResult.receiptNumber}
              </span>
              <h3 className="font-code-plate text-headline-xl font-bold text-primary mt-1">
                {receiptResult.session.licensePlate}
              </h3>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl space-y-2 text-left font-body-md text-body-md">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Assigned Spot:</span>
                <span className="font-code-plate font-bold text-on-surface">
                  {receiptResult.assignedSpot.spotNumber} ({receiptResult.assignedSpot.level})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Vehicle Class:</span>
                <span className="font-title-sm text-on-surface capitalize">
                  {receiptResult.session.vehicleType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Ingress Time:</span>
                <span className="font-body-sm text-on-surface">Just Now</span>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={() => setReceiptResult(null)}>
              Done / Next Check-In
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

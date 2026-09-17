import React, { useState } from 'react';
import { useSpotsData } from '../hooks/useParkingQueries';
import { ParkingSpot, VehicleType } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { formatCurrency } from '../utils/currency';

export const SpotsPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('Level 1');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  const { data: spots, isLoading } = useSpotsData(
    selectedLevel,
    selectedType !== 'all' ? (selectedType as VehicleType) : undefined
  );

  const filteredSpots = (spots || []).filter((s) => {
    if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    return true;
  });

  const availableCount = filteredSpots.filter((s) => s.status === 'available').length;
  const occupiedCount = filteredSpots.filter((s) => s.status === 'occupied').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            Parking Bay & Level Map
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Interactive occupancy matrix & LPR bay telemetry
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="available" size="md">
            {availableCount} Available
          </Badge>
          <Badge variant="occupied" size="md">
            {occupiedCount} Occupied
          </Badge>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Level 1', 'Level 2', 'Level 3'].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-5 py-2.5 rounded-xl font-title-sm text-[14px] transition-all whitespace-nowrap ${
              selectedLevel === level
                ? 'bg-primary text-on-primary font-bold shadow-md'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Type:</span>
          {['all', 'compact', 'standard', 'ev'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg font-label-caps text-[11px] uppercase transition-colors ${
                selectedType === type
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Status:</span>
          {['all', 'available', 'occupied'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-lg font-label-caps text-[11px] uppercase transition-colors ${
                selectedStatus === status
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Spots Visual Matrix Grid */}
      {isLoading ? (
        <LoadingSkeleton count={3} height="h-36" />
      ) : filteredSpots.length === 0 ? (
        <div className="p-8 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-on-surface-variant">
          No parking bays match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              className={`cursor-pointer p-3.5 rounded-xl shadow-sm border transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between min-h-[120px] ${
                spot.status === 'available'
                  ? 'bg-secondary-container/20 border-secondary/30 hover:bg-secondary-container/40'
                  : 'bg-error-container/20 border-error/30 hover:bg-error-container/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-code-plate text-[16px] font-bold text-on-surface">
                    {spot.spotNumber}
                  </span>
                  {spot.hasEvCharger && (
                    <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
                  )}
                </div>
                <Badge variant={spot.status === 'available' ? 'available' : 'occupied'}>
                  {spot.status === 'available' ? 'AVAIL' : 'OCC'}
                </Badge>
              </div>

              <div className="mt-3 flex flex-col">
                {spot.status === 'occupied' ? (
                  <>
                    <span className="font-code-plate text-[14px] font-bold text-on-surface tracking-wider">
                      {spot.currentVehiclePlate || 'PARKED'}
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                      {spot.parkedDuration || 'Active'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">
                      {spot.type} Bay
                    </span>
                    <span className="font-code-plate text-[13px] font-bold text-secondary mt-0.5">
                      {formatCurrency(spot.hourlyRate)}/hr
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spot Detail Inspector Modal */}
      <Modal
        isOpen={!!selectedSpot}
        onClose={() => setSelectedSpot(null)}
        title={`Spot Telemetry Inspector — ${selectedSpot?.spotNumber}`}
      >
        {selectedSpot && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  Location
                </span>
                <h4 className="font-title-sm text-title-sm font-bold text-on-surface">
                  {selectedSpot.level} · {selectedSpot.sector}
                </h4>
              </div>
              <Badge variant={selectedSpot.status === 'available' ? 'available' : 'occupied'} size="md">
                {selectedSpot.status.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2 font-body-md text-body-md text-on-surface">
              <div className="flex justify-between py-1.5 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Spot Classification:</span>
                <span className="font-title-sm capitalize font-semibold">{selectedSpot.type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Hourly Rate:</span>
                <span className="font-code-plate font-bold">{formatCurrency(selectedSpot.hourlyRate)} / hr</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">EV Charger:</span>
                <span className="font-title-sm">
                  {selectedSpot.hasEvCharger ? `${selectedSpot.chargerPowerKw}kW Level-2` : 'None'}
                </span>
              </div>
              {selectedSpot.status === 'occupied' && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Occupying License Plate:</span>
                    <span className="font-code-plate font-bold text-primary">
                      {selectedSpot.currentVehiclePlate}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-on-surface-variant">Session Duration:</span>
                    <span className="font-body-sm font-bold">{selectedSpot.parkedDuration}</span>
                  </div>
                </>
              )}
            </div>

            <Button size="lg" className="w-full mt-2" onClick={() => setSelectedSpot(null)}>
              Close Inspector
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVehicleSearch } from '../hooks/useParkingQueries';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPlate = searchParams.get('plate') || '';
  const [plateInput, setPlateInput] = useState(initialPlate);
  const [searchQuery, setSearchQuery] = useState(initialPlate);

  const navigate = useNavigate();
  const { data: session, isLoading } = useVehicleSearch(searchQuery);

  useEffect(() => {
    if (initialPlate) {
      setPlateInput(initialPlate);
      setSearchQuery(initialPlate);
    }
  }, [initialPlate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plateInput.trim()) {
      setSearchQuery(plateInput.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            Vehicle & License Plate Lookup
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Locate active vehicles, check session telemetry & initiate check-out
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[28px]">search</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          isPlateInput
          placeholder="ENTER FULL OR PARTIAL LICENSE PLATE..."
          value={plateInput}
          onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
          className="flex-1 text-[16px]"
        />
        <Button type="submit" size="lg" className="px-6">
          <span className="material-symbols-outlined text-[20px] mr-1">search</span>
          Locate
        </Button>
      </form>

      {/* Results View */}
      {isLoading ? (
        <Card className="p-8 text-center animate-pulse">Querying active LPR database...</Card>
      ) : !searchQuery ? (
        <EmptyState
          icon="manage_search"
          title="Search Vehicle Database"
          description="Enter a license plate number above to locate active parking sessions and bay details."
        />
      ) : !session ? (
        <EmptyState
          icon="search_off"
          title="No Active Vehicle Session"
          description={`No active parking session found matching license plate "${searchQuery}".`}
        />
      ) : (
        <Card className="p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
            <div>
              <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">
                Active Parking Session
              </span>
              <h3 className="font-code-plate text-headline-xl font-bold text-primary mt-0.5">
                {session.licensePlate}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={session.status === 'overstay' ? 'occupied' : 'available'} size="md">
                {session.status.toUpperCase()}
              </Badge>
              <Badge variant="neutral" size="md">
                {session.vehicleType.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                Parking Bay
              </span>
              <p className="font-code-plate text-headline-md font-bold text-on-surface mt-1">
                Spot {session.spotNumber}
              </p>
              <span className="font-body-sm text-[12px] text-on-surface-variant">
                {session.level} · {session.sector}
              </span>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                Ingress Time
              </span>
              <p className="font-title-sm text-[15px] font-bold text-on-surface mt-1">
                {new Date(session.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <span className="font-body-sm text-[12px] text-on-surface-variant">Gate #02 LPR</span>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                Current Duration
              </span>
              <p className="font-title-sm text-[15px] font-bold text-secondary mt-1">
                {session.formattedDuration}
              </p>
              <span className="font-body-sm text-[12px] text-on-surface-variant">
                Billed: {session.feeBreakdown?.billedHours || 1} hrs
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              size="lg"
              onClick={() => navigate(`/check-out?plate=${encodeURIComponent(session.licensePlate)}`)}
              className="gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Proceed to Check-Out & Billing
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

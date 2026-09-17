import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../../services/parkingService';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export const CustomerSpotsPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const {
    data: spots = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['customerAvailableSpots'],
    queryFn: () => parkingService.getAvailableSpots(),
  });

  const levels = Array.from(new Set(spots.map((s) => s.level))).sort();

  const filteredSpots = spots.filter(
    (s) => selectedLevel === 'ALL' || s.level.toLowerCase() === selectedLevel.toLowerCase()
  );

  // Group spots by Level
  const spotsByLevel: { [level: string]: typeof spots } = {};
  filteredSpots.forEach((s) => {
    if (!spotsByLevel[s.level]) {
      spotsByLevel[s.level] = [];
    }
    spotsByLevel[s.level].push(s);
  });

  return (
    <div className="space-y-6">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">local_parking</span>
            <span>Live Available Parking Spots</span>
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time vacant parking bays directly from MongoDB Atlas
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <span className={`material-symbols-outlined text-[18px] ${isRefetching ? 'animate-spin' : ''}`}>
            refresh
          </span>
          <span>{isRefetching ? 'Refreshing...' : 'Refresh Spots'}</span>
        </button>
      </div>

      {/* Level Filter Tabs */}
      {levels.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedLevel('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLevel === 'ALL'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Levels ({spots.length})
          </button>
          {levels.map((lvl) => {
            const count = spots.filter((s) => s.level === lvl).length;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedLevel === lvl
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {lvl} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Spots List */}
      {isLoading ? (
        <LoadingSkeleton count={4} height="h-28" />
      ) : Object.keys(spotsByLevel).length === 0 ? (
        <div className="p-12 text-center bg-surface-container rounded-3xl border border-outline-variant/30 space-y-3">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">event_seat</span>
          </div>
          <h3 className="font-bold text-lg text-on-surface">No vacant parking spots currently available</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            All parking spots are currently occupied or undergoing routine maintenance. Please check back in a few minutes.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(spotsByLevel).map(([level, levelSpots]) => (
            <div key={level} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
                <h2 className="font-bold text-base text-on-surface">{level}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                  {levelSpots.length} Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-secondary" />
                        <span className="font-mono text-lg font-extrabold text-on-surface">
                          {spot.spotNumber}
                        </span>
                      </div>

                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-secondary/15 text-secondary">
                        Available
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {spot.sector}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest uppercase font-bold text-[10px]">
                        {spot.type}
                      </span>
                    </div>

                    {spot.hasEvCharger ? (
                      <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-between text-xs text-secondary font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">ev_station</span>
                          <span>EV Charger Ready</span>
                        </span>
                        <span className="font-mono text-[11px] font-bold">{spot.chargerPowerKw || 22} kW</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-on-surface-variant flex items-center gap-1 pt-1">
                        <span className="material-symbols-outlined text-[16px]">info</span>
                        <span>Standard Parking Bay</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

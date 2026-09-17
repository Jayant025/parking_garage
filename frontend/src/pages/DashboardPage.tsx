import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboardData } from '../hooks/useParkingQueries';
import { formatCurrency } from '../utils/currency';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { data: metrics, isLoading, isError, refetch } = useDashboardData();
  const [quickPlateSearch, setQuickPlateSearch] = useState('');
  const navigate = useNavigate();

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPlateSearch.trim()) {
      navigate(`/search?plate=${encodeURIComponent(quickPlateSearch.trim())}`);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton count={4} height="h-32" />;
  }

  if (isError || !metrics) {
    return <ErrorState onRetry={refetch} />;
  }

  // Sample chart data derived from net revenue metrics
  const chartData = [
    { hour: '06:00', revenue: 420 },
    { hour: '09:00', revenue: 1280 },
    { hour: '12:00', revenue: 2450 },
    { hour: '15:00', revenue: 3890 },
    { hour: '18:00', revenue: 4520 },
    { hour: '21:00', revenue: metrics.netRevenueToday },
  ];

  return (
    <div className="space-y-6">
      {/* Operational Banner */}
      <section className="bg-surface-container rounded-2xl p-4 md:p-5 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[26px]">corporate_fare</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-caps text-[10px] text-secondary uppercase font-semibold">
                Active Feed Connected
              </span>
              <span className="font-label-caps text-[10px] text-on-surface-variant">
                · API 200 OK (38ms)
              </span>
            </div>
            <h2 className="font-title-sm text-headline-md text-on-surface font-bold mt-0.5">
              Downtown Central Station
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Automated LPR Gate System · Levels 1–3
            </p>
          </div>
        </div>

        {/* Quick Search Widget */}
        <form onSubmit={handleQuickSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
          <Input
            isPlateInput
            placeholder="ENTER PLATE..."
            value={quickPlateSearch}
            onChange={(e) => setQuickPlateSearch(e.target.value)}
            className="h-10 text-[14px]"
          />
          <Button type="submit" size="md">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </Button>
        </form>
      </section>

      {/* 2x3 Key Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {/* Total Capacity */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Total Capacity</span>
            <span className="material-symbols-outlined text-[20px] text-outline">storage</span>
          </div>
          <div className="mt-2">
            <div className="font-data-metric text-headline-xl text-on-surface tabular-nums font-bold">
              {metrics.totalCapacity}
            </div>
            <span className="font-label-caps text-[10px] text-on-surface-variant">Max Garage Load</span>
          </div>
        </div>

        {/* Available Spots */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Available Bays</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">
              +{metrics.availableRatePerHour}/hr
            </span>
          </div>
          <div className="mt-2">
            <div className="font-data-metric text-headline-xl text-secondary tabular-nums font-bold">
              {metrics.availableSpots}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-caps text-[10px] text-on-surface-variant">Open for ingress</span>
            </div>
          </div>
        </div>

        {/* Occupied Spots */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Occupied</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant tabular-nums font-bold">
              {metrics.occupancyPercentage}%
            </span>
          </div>
          <div className="mt-2">
            <div className="font-data-metric text-headline-xl text-on-surface tabular-nums font-bold">
              {metrics.occupiedSpots}
            </div>
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.occupancyPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* EV Ports Available */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">EV Ports Free</span>
            <span className="material-symbols-outlined text-[20px] text-primary">bolt</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-data-metric text-headline-xl text-primary tabular-nums font-bold">
                {metrics.evPortsAvailable}
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant tabular-nums">
                / {metrics.evPortsTotal}
              </span>
            </div>
            <span className="font-label-caps text-[10px] text-on-surface-variant">
              {metrics.evPortsCharging} fast-charging
            </span>
          </div>
        </div>

        {/* Turnover Today */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Turnover Today</span>
            <span className="material-symbols-outlined text-[20px] text-outline">sync_alt</span>
          </div>
          <div className="mt-2">
            <div className="font-data-metric text-headline-xl text-on-surface tabular-nums font-bold">
              {metrics.turnoverToday}
            </div>
            <span className="font-label-caps text-[10px] text-secondary font-semibold">
              Check-ins processed
            </span>
          </div>
        </div>

        {/* Net Revenue */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Net Revenue</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">
              +{metrics.revenueChangePercent}%
            </span>
          </div>
          <div className="mt-2">
            <div className="font-headline-md text-headline-lg text-on-surface tabular-nums font-bold leading-tight">
              {formatCurrency(metrics.netRevenueToday)}
            </div>
            <span className="font-label-caps text-[10px] text-on-surface-variant">
              Avg {formatCurrency(metrics.avgRevenuePerTicket)} / ticket
            </span>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Bar */}
      <section className="flex flex-wrap items-center gap-3">
        <Link to="/check-in" className="flex-1 min-w-[160px]">
          <Button size="lg" className="w-full gap-2 shadow-md">
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>Check-In Vehicle</span>
          </Button>
        </Link>
        <Link to="/check-out" className="flex-1 min-w-[160px]">
          <Button size="lg" variant="secondary" className="w-full gap-2 border border-outline-variant/60">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Check-Out & Bill</span>
          </Button>
        </Link>
        <Link to="/spots" className="flex-1 min-w-[160px]">
          <Button size="lg" variant="outline" className="w-full gap-2">
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <span>View Spots Map</span>
          </Button>
        </Link>
      </section>

      {/* Main Grid: Revenue Trend Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-title-sm text-title-sm text-on-surface font-bold">Hourly Revenue Trend</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Cumulative revenue stream across all gate lanes today
              </p>
            </div>
            <Badge variant="available">Live Stream</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.3} />
                <XAxis dataKey="hour" stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-container-high)',
                    borderColor: 'var(--outline-variant)',
                    borderRadius: '8px',
                    color: 'var(--on-surface)',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Recent Parking Activity Feed */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-title-sm text-title-sm text-on-surface font-bold">Recent Activity</h3>
            <Link to="/history" className="font-label-caps text-[11px] text-primary hover:underline uppercase">
              View All
            </Link>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {metrics.recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface font-code-plate text-[13px] font-bold tracking-wider">
                    {act.licensePlate}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-[13px] text-on-surface font-semibold">
                      Spot {act.spotNumber} ({act.level})
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
                <Badge variant={act.type === 'check_in' ? 'available' : 'occupied'}>
                  {act.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floor Occupancy Breakdown */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
        <h3 className="font-title-sm text-title-sm text-on-surface font-bold mb-3">Floor & Level Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.floorOccupancy.map((floor) => (
            <div key={floor.level} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-title-sm text-[14px] font-bold text-on-surface">{floor.level}</span>
                <span className="font-label-caps text-[11px] text-on-surface-variant">
                  {floor.occupied} / {floor.total} bays
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    floor.percentage > 85 ? 'bg-error' : floor.percentage > 70 ? 'bg-primary' : 'bg-secondary'
                  }`}
                  style={{ width: `${floor.percentage}%` }}
                />
              </div>
              <span className="font-label-caps text-[10px] text-on-surface-variant mt-1.5 block text-right">
                {floor.percentage}% Capacity
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

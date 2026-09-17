import React from 'react';
import { useReportsData } from '../hooks/useParkingQueries';
import { formatCurrency } from '../utils/currency';
import { Card } from '../components/ui/Card';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { data: reports, isLoading } = useReportsData();

  if (isLoading || !reports) return <LoadingSkeleton count={3} height="h-48" />;

  const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            Reports & Analytics Hub
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Revenue telemetry, vehicle turnover & bay utilization metrics
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[28px]">analytics</span>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Total Sessions</span>
          <div className="font-data-metric text-headline-xl font-bold text-on-surface mt-1">
            {reports.summary.totalSessions}
          </div>
        </Card>
        <Card className="p-4">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Total Gross Revenue</span>
          <div className="font-data-metric text-headline-xl font-bold text-secondary mt-1">
            {formatCurrency(reports.summary.totalRevenue)}
          </div>
        </Card>
        <Card className="p-4">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Duration</span>
          <div className="font-data-metric text-headline-xl font-bold text-primary mt-1">
            {Math.floor(reports.summary.avgDurationMinutes / 60)}h {reports.summary.avgDurationMinutes % 60}m
          </div>
        </Card>
        <Card className="p-4">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Peak Occupancy</span>
          <div className="font-title-sm text-[14px] font-bold text-on-surface mt-2">
            {reports.summary.peakOccupancyTime}
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Occupancy by Class */}
        <Card className="p-5 space-y-4">
          <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
            Occupancy Breakdown by Class
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports.occupancyByHour}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.3} />
                <XAxis dataKey="hour" stroke="var(--on-surface-variant)" fontSize={12} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-container-high)',
                    borderRadius: '8px',
                    color: 'var(--on-surface)',
                  }}
                />
                <Bar dataKey="standard" fill="var(--primary)" name="Standard" />
                <Bar dataKey="compact" fill="var(--secondary)" name="Compact" />
                <Bar dataKey="ev" fill="var(--tertiary)" name="EV" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spot Type Distribution */}
        <Card className="p-5 space-y-4">
          <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
            Vehicle Type Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reports.typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {reports.typeDistribution.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

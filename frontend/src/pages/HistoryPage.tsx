import React, { useState } from 'react';
import { useParkingHistory } from '../hooks/useParkingQueries';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { formatCurrency } from '../utils/currency';

export const HistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useParkingHistory(searchTerm, statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            Parking History & Logs
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Historical transaction telemetry & gate audit records
          </p>
        </div>
        <Badge variant="neutral" size="md">
          Total Records: {data?.total || 0}
        </Badge>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search plate or spot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Status:</span>
          {['all', 'active', 'completed', 'overstay'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-label-caps text-[11px] uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden border border-outline-variant/30">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton count={5} height="h-12" />
          </div>
        ) : !data || data.sessions.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">No parking records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 font-label-caps text-[11px] text-on-surface-variant uppercase">
                  <th className="px-4 py-3">License Plate</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Assigned Spot</th>
                  <th className="px-4 py-3">Ingress</th>
                  <th className="px-4 py-3">Egress</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Total Fee</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md text-on-surface">
                {data.sessions.map((ses) => (
                  <tr key={ses.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-4 py-3 font-code-plate text-[14px] font-bold text-primary">
                      {ses.licensePlate}
                    </td>
                    <td className="px-4 py-3 capitalize font-body-sm">{ses.vehicleType}</td>
                    <td className="px-4 py-3 font-code-plate text-[13px]">
                      {ses.spotNumber} ({ses.level})
                    </td>
                    <td className="px-4 py-3 font-body-sm text-on-surface-variant">
                      {new Date(ses.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-body-sm text-on-surface-variant">
                      {ses.exitTime
                        ? new Date(ses.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 font-body-sm">{ses.formattedDuration}</td>
                    <td className="px-4 py-3 font-code-plate font-bold">
                      {ses.feeBreakdown?.totalFee ? formatCurrency(ses.feeBreakdown.totalFee) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          ses.status === 'completed'
                            ? 'neutral'
                            : ses.status === 'active'
                            ? 'available'
                            : 'occupied'
                        }
                      >
                        {ses.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parkingService } from '../services/parkingService';
import { TicketStatus } from '../types';
import { Input } from '../components/ui/Input';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

export const OperatorSupportPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: tickets = [], isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['operatorSupportTickets', statusFilter, searchTerm],
    queryFn: () => parkingService.getAdminSupportTickets(statusFilter, searchTerm),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      parkingService.updateTicketStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operatorSupportTickets'] });
    },
  });

  const selectedTicket = tickets.find((t) => t._id === selectedTicketId) || tickets[0] || null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-error/15 text-error">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-tertiary/15 text-tertiary">IN PROGRESS</span>;
      case 'RESOLVED':
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-secondary/15 text-secondary">RESOLVED</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-surface-container-highest text-on-surface">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">support_agent</span>
            <span>Customer Support Management</span>
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            View, investigate, and resolve customer support tickets submitted across the platform
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
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by name, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content: Split List & Detail View */}
      {isLoading ? (
        <LoadingSkeleton count={4} height="h-32" />
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center bg-surface-container rounded-3xl border border-outline-variant/30 space-y-2">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant">inbox</span>
          <h3 className="font-bold text-on-surface">No customer support tickets found</h3>
          <p className="text-xs text-on-surface-variant">
            {statusFilter !== 'ALL' || searchTerm
              ? 'Try adjusting your filter or search query.'
              : 'Customer support tickets will appear here when submitted.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket List Column */}
          <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {tickets.map((t) => {
              const isSelected = selectedTicket?._id === t._id;
              return (
                <div
                  key={t._id}
                  onClick={() => setSelectedTicketId(t._id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-md'
                      : 'bg-surface-container border-outline-variant/30 hover:border-outline-variant'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-on-surface truncate max-w-[200px]">
                      {t.subject}
                    </span>
                    {getStatusBadge(t.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="font-semibold text-on-surface">{t.name}</span>
                    <span className="font-mono text-[11px]">{t.email}</span>
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2">{t.message}</p>

                  <div className="text-[10px] text-on-surface-variant pt-1 border-t border-outline-variant/20 flex justify-between">
                    <span className="uppercase font-bold text-primary">{t.category}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Detail Inspector Column */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-6 shadow-sm sticky top-24">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/30 pb-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary">
                      {selectedTicket.category}
                    </span>
                    <h2 className="text-xl font-bold text-on-surface">{selectedTicket.subject}</h2>
                    <p className="text-xs text-on-surface-variant">
                      Submitted on {new Date(selectedTicket.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>{getStatusBadge(selectedTicket.status)}</div>
                </div>

                {/* Customer Details Box */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-on-surface-variant font-semibold">Customer Name:</span>
                    <p className="font-bold text-on-surface text-sm mt-0.5">{selectedTicket.name}</p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-semibold">Customer Email:</span>
                    <p className="font-mono text-on-surface font-semibold text-sm mt-0.5">{selectedTicket.email}</p>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Customer Message:
                  </span>
                  <div className="p-4 rounded-2xl bg-surface-container-highest/60 text-xs text-on-surface leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedTicket.message}
                  </div>
                </div>

                {/* Change Ticket Status Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Update Ticket Status:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(['OPEN', 'IN_PROGRESS', 'RESOLVED'] as TicketStatus[]).map((st) => {
                      const isActive = selectedTicket.status === st;
                      return (
                        <button
                          key={st}
                          onClick={() =>
                            updateStatusMutation.mutate({ id: selectedTicket._id, status: st })
                          }
                          disabled={updateStatusMutation.isPending || isActive}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/40 text-on-surface'
                          }`}
                        >
                          {st === 'RESOLVED' && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                          {st === 'IN_PROGRESS' && <span className="material-symbols-outlined text-[16px]">pending</span>}
                          {st === 'OPEN' && <span className="material-symbols-outlined text-[16px]">error</span>}
                          <span>Mark as {st.replace('_', ' ')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-surface-container rounded-3xl border border-outline-variant/30">
                <p className="text-sm text-on-surface-variant">Select a ticket on the left to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

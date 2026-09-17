import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parkingService } from '../../services/parkingService';
import { TicketCategory } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export const CustomerSupportPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('GENERAL');
  const [message, setMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Fetch customer's own support tickets
  const { data: tickets = [], isLoading: isLoadingTickets } = useQuery({
    queryKey: ['mySupportTickets'],
    queryFn: () => parkingService.getMySupportTickets(),
  });

  // Submit ticket mutation
  const submitMutation = useMutation({
    mutationFn: (newTicket: { subject: string; category: TicketCategory; message: string }) =>
      parkingService.createSupportTicket(newTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySupportTickets'] });
      setFormSuccess('Your support ticket has been submitted to garage operators!');
      setSubject('');
      setMessage('');
      setCategory('GENERAL');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit support request.';
      setFormError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess('');
    setFormError('');

    if (!subject.trim() || !message.trim()) {
      setFormError('Please fill out both subject and message fields.');
      return;
    }

    submitMutation.mutate({ subject, category, message });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-error/15 text-error">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-tertiary/15 text-tertiary">IN PROGRESS</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-secondary/15 text-secondary">RESOLVED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-container-highest text-on-surface">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">help</span>
          <span>Customer Support & Inquiries</span>
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Need assistance with parking, payment, EV chargers, or garage services? Submit a ticket directly to our operator team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ticket Submission Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-4 shadow-sm h-fit">
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">add_comment</span>
            <span>Submit Support Request</span>
          </h2>

          {formSuccess && (
            <div className="p-3.5 bg-secondary-container/40 text-on-secondary-container rounded-2xl font-body-sm text-xs flex items-center gap-2 border border-secondary/30">
              <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3.5 bg-error-container/40 text-on-error-container rounded-2xl font-body-sm text-xs flex items-center gap-2 border border-error/30">
              <span className="material-symbols-outlined text-[20px] text-error">error</span>
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Subject"
              placeholder="e.g., Billing discrepancy / EV Charger issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-semibold border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="GENERAL">General Inquiry</option>
                <option value="BILLING">Billing & Payments</option>
                <option value="PARKING_ISSUE">Parking Spot / Barrier Issue</option>
                <option value="TECHNICAL">EV Charger / Technical Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Message Details
              </label>
              <textarea
                rows={4}
                placeholder="Describe your issue or question in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-medium border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 shadow-md"
              isLoading={submitMutation.isPending}
            >
              Submit Ticket to Operator
            </Button>
          </form>
        </div>

        {/* User's Submitted Tickets History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">confirmation_number</span>
              <span>My Support Tickets ({tickets.length})</span>
            </h2>
          </div>

          {isLoadingTickets ? (
            <LoadingSkeleton count={3} height="h-28" />
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center bg-surface-container rounded-3xl border border-outline-variant/30 space-y-2">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant">inbox</span>
              <p className="font-bold text-on-surface">No support tickets submitted yet</p>
              <p className="text-xs text-on-surface-variant">
                Use the form on the left to reach out to our team anytime.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t._id}
                  className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-on-surface">{t.subject}</span>
                    {getStatusBadge(t.status)}
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {t.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/20">
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest uppercase font-bold text-[10px]">
                      {t.category.replace('_', ' ')}
                    </span>
                    <span>
                      Submitted on {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

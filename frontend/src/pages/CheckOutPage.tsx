import React, { useState } from 'react';
import { useVehicleSearch, useCheckOutMutation } from '../hooks/useParkingQueries';
import { PaymentMethod, CheckOutResponse } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/currency';

export const CheckOutPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [activePlate, setActivePlate] = useState('MH12AB1234'); // Default active demo plate
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [checkoutResult, setCheckoutResult] = useState<CheckOutResponse | null>(null);

  const { data: session, isLoading } = useVehicleSearch(activePlate);
  const checkoutMutation = useCheckOutMutation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActivePlate(searchInput.trim().toUpperCase());
    }
  };

  const handleCompleteCheckout = () => {
    if (!activePlate) return;
    checkoutMutation.mutate(
      {
        licensePlate: activePlate,
        paymentMethod,
      },
      {
        onSuccess: (res) => {
          setCheckoutResult(res);
        },
      }
    );
  };

  const fee = session?.feeBreakdown;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            Check-Out & Billing Workflow
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            LPR session lookup, fee breakdown & gate release
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[28px]">logout</span>
        </div>
      </div>

      {/* Plate Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          isPlateInput
          placeholder="SEARCH PLATE E.G. MH12AB1234..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
          className="flex-1 text-[15px]"
        />
        <Button type="submit" size="lg" className="px-6">
          <span className="material-symbols-outlined text-[20px] mr-1">search</span>
          Search
        </Button>
      </form>

      {/* Active Session Content */}
      {isLoading ? (
        <Card className="p-8 text-center animate-pulse">Searching active session...</Card>
      ) : !session ? (
        <EmptyState
          icon="search_off"
          title="No Active Session Found"
          description={`No active parking session found for plate "${activePlate}". Try searching another plate or check history.`}
        />
      ) : (
        <div className="space-y-6">
          {/* Active Session Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  Active Session
                </span>
                <h3 className="font-code-plate text-headline-md font-bold text-primary">
                  {session.licensePlate}
                </h3>
              </div>
              <div className="text-right">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  Assigned Bay
                </span>
                <p className="font-title-sm text-title-sm font-bold text-primary">
                  {session.spotNumber}
                </p>
                <span className="font-body-sm text-[11px] text-on-surface-variant">{session.level}</span>
              </div>
            </div>

            {/* Ingress / Egress Grid */}
            <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3.5 rounded-xl">
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">login</span>
                  Ingress Time
                </span>
                <span className="font-title-sm text-[13px] font-semibold text-on-surface pt-0.5">
                  Today, {new Date(session.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-label-caps text-[10px] text-outline">Gate #02 LPR Scanner</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">logout</span>
                  Egress Time (Now)
                </span>
                <span className="font-title-sm text-[13px] font-semibold text-on-surface pt-0.5">
                  Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-label-caps text-[10px] text-outline">Cashier Lane 4</span>
              </div>
            </div>

            {/* Billed Duration Strip */}
            <div className="flex items-center justify-between bg-surface-container-high/60 p-3.5 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                </div>
                <div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                    Duration
                  </span>
                  <p className="font-title-sm text-title-sm text-on-surface font-bold leading-tight">
                    {session.formattedDuration}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-primary text-on-primary font-label-caps text-[10px] px-2 py-0.5 rounded font-bold">
                  {fee?.billedHours} hrs Billed
                </span>
                <p className="font-body-sm text-[10px] text-on-surface-variant mt-0.5">
                  Partial-hour rounded ceiling
                </p>
              </div>
            </div>
          </Card>

          {/* Fee Calculation Breakdown Card */}
          {fee && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">calculate</span>
                  <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
                    Calculated Fee Breakdown (INR)
                  </h3>
                </div>
                <Badge variant="available">Tier A Rate</Badge>
              </div>

              <div className="space-y-2.5 font-body-md text-body-md text-on-surface">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">First Hour Rate</span>
                  <span className="font-code-plate text-on-surface font-semibold">
                    {formatCurrency(fee.firstHourRate)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">
                    Additional Hours ({fee.billedHours - 1} hrs @ {formatCurrency(fee.additionalHourRate)}/hr)
                  </span>
                  <span className="font-code-plate text-on-surface font-semibold">
                    {formatCurrency((fee.billedHours - 1) * fee.additionalHourRate)}
                  </span>
                </div>
                <div className="h-px bg-outline-variant/30 my-1" />
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-code-plate text-on-surface font-semibold">
                    {formatCurrency(fee.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-outline">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified_user</span>
                    Daily Max Cap ({formatCurrency(fee.dailyMaxCap)})
                  </span>
                  <span className="text-secondary font-label-caps font-bold">{fee.capStatus}</span>
                </div>
                <div className="flex justify-between items-center text-body-sm">
                  <span className="text-on-surface-variant">Municipal Tax</span>
                  <span className="font-code-plate text-on-surface font-semibold">
                    {formatCurrency(fee.taxAmount)}
                  </span>
                </div>

                {/* Total Due Banner */}
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between mt-3">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Total Amount Due
                    </span>
                    <p className="font-body-sm text-[11px] text-outline">Tax & fees included</p>
                  </div>
                  <span className="font-data-metric text-headline-xl font-bold text-primary tabular-nums tracking-tight">
                    {formatCurrency(fee.totalFee)}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Payment Method Selector */}
          <Card className="p-5 space-y-4">
            <h3 className="font-title-sm text-title-sm font-bold text-on-surface border-b border-outline-variant/30 pb-3">
              Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cash', title: 'Cash', desc: 'Physical Drawer', icon: 'payments', iconColor: 'text-secondary' },
                { id: 'card', title: 'Credit / Debit', desc: 'Terminal Reader', icon: 'credit_card', iconColor: 'text-primary' },
                { id: 'app', title: 'Prepaid App', desc: 'QR Wallet Ping', icon: 'smartphone', iconColor: 'text-tertiary' },
                { id: 'pass', title: 'Validation Pass', desc: 'Merchant Voucher', icon: 'confirmation_number', iconColor: 'text-outline' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    paymentMethod === method.id
                      ? 'bg-primary-container text-on-primary-container border-primary shadow-md'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[24px] ${method.iconColor}`}>
                    {method.icon}
                  </span>
                  <div>
                    <p className="font-title-sm text-[13px] font-bold leading-tight">{method.title}</p>
                    <span className="font-label-caps text-[10px] opacity-80">{method.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Error Message */}
            {checkoutMutation.isError && (
              <div className="p-3 bg-error-container text-on-error-container rounded-xl font-body-sm text-[12px]">
                {checkoutMutation.error.message}
              </div>
            )}

            {/* Complete Check-Out Button */}
            <Button
              size="lg"
              className="w-full text-headline-md h-14 shadow-lg gap-2 mt-4"
              isLoading={checkoutMutation.isPending}
              onClick={handleCompleteCheckout}
            >
              <span className="material-symbols-outlined text-[24px]">check_circle</span>
              Complete Check-Out & Release Bay
            </Button>
          </Card>
        </div>
      )}

      {/* Check-Out Success Receipt Modal */}
      <Modal
        isOpen={!!checkoutResult}
        onClose={() => setCheckoutResult(null)}
        title="Check-Out Complete Receipt"
      >
        {checkoutResult && (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-[36px]">receipt_long</span>
            </div>

            <div>
              <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">
                Paid Receipt #{checkoutResult.receiptNumber}
              </span>
              <h3 className="font-code-plate text-headline-xl font-bold text-primary mt-1">
                {checkoutResult.session.licensePlate}
              </h3>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl space-y-2 text-left font-body-md text-body-md">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Released Bay:</span>
                <span className="font-code-plate font-bold text-on-surface">
                  {checkoutResult.session.spotNumber} ({checkoutResult.session.level})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Paid Amount:</span>
                <span className="font-headline-md font-bold text-secondary">
                  {formatCurrency(checkoutResult.session.feeBreakdown?.totalFee || checkoutResult.session.durationMinutes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Payment Method:</span>
                <span className="font-title-sm text-on-surface uppercase">
                  {checkoutResult.session.paymentMethod}
                </span>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={() => setCheckoutResult(null)}>
              Done / Return to Dashboard
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

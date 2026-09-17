import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePricingData, useUpdatePricingMutation } from '../hooks/useParkingQueries';
import { PricingTier } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { parkingService } from '../services/parkingService';
import { formatCurrency } from '../utils/currency';

const SAMPLE_MESSY_RATE_CARD = `[
  { "type": "compact", "firstHour": "Rs. 50/-", "additionalHour": "₹30/hr", "dailyMax": "300 rupees" },
  { "type": "Standard", "firstHour": "80 INR", "additionalHour": "Rs 40 per hour", "dailyMax": "Rs. 500/-" },
  { "type": "EV", "firstHour": "₹ 100", "additionalHour": "50 INR", "dailyMax": "600/day", "evFee": "Rs. 20/-" }
]`;

export const PricingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: pricingData, isLoading } = usePricingData();
  const updateMutation = useUpdatePricingMutation();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // T4 Messy Rate Card Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [rawInputText, setRawInputText] = useState(SAMPLE_MESSY_RATE_CARD);
  const [cleanedPreview, setCleanedPreview] = useState<PricingTier[] | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  useEffect(() => {
    if (pricingData) {
      setTiers(pricingData);
    }
  }, [pricingData]);

  const handleChange = (id: string, field: keyof PricingTier, value: number) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = () => {
    updateMutation.mutate(tiers, {
      onSuccess: () => {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      },
    });
  };

  // T4: Parse & Preview
  const handleParseRateCard = async () => {
    setImportErrors([]);
    setCleanedPreview(null);
    setIsParsing(true);

    try {
      const res = await parkingService.parseRateCard(rawInputText);
      if (res.success && res.data.length > 0) {
        setCleanedPreview(res.data);
      } else {
        setImportErrors(res.errors.length > 0 ? res.errors : ['Failed to clean rate card. Check format.']);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error parsing rate card.';
      setImportErrors([msg]);
    } finally {
      setIsParsing(false);
    }
  };

  // T4: Confirm & Import
  const handleConfirmImport = async () => {
    setIsImporting(true);
    setImportErrors([]);

    try {
      const res = await parkingService.importRateCard(cleanedPreview || rawInputText);
      if (res.success) {
        setImportSuccessMsg(res.message || 'Messy rate card cleaned & imported successfully!');
        queryClient.invalidateQueries({ queryKey: ['pricing'] });
        queryClient.invalidateQueries({ queryKey: ['spots'] });
        setTimeout(() => {
          setIsImportModalOpen(false);
          setCleanedPreview(null);
          setImportSuccessMsg('');
        }, 2000);
      }
    } catch (err: any) {
      const msgs = err?.response?.data?.errors || [err?.response?.data?.message || err?.message || 'Import failed.'];
      setImportErrors(msgs);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setRawInputText(text);
        setCleanedPreview(null);
        setImportErrors([]);
      };
      reader.readAsText(file);
    }
  };

  if (isLoading) return <LoadingSkeleton count={3} height="h-40" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            Rate Tier & Pricing Configuration (INR)
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Set base hourly fees in ₹, additional rates & daily cap thresholds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsImportModalOpen(true);
              setImportErrors([]);
              setCleanedPreview(null);
            }}
            className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            <span>Import Messy Rate Card (T4)</span>
          </Button>

          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[28px]">payments</span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl font-body-sm text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Pricing configuration saved successfully to backend.</span>
        </div>
      )}

      {/* Tiers List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="font-title-sm text-title-sm font-bold text-on-surface">{tier.name}</h3>
              <Badge variant="ev">{tier.vehicleType.toUpperCase()}</Badge>
            </div>

            <div className="space-y-3">
              <Input
                label="First Hour Rate (₹)"
                type="number"
                value={tier.firstHourRate}
                onChange={(e) => handleChange(tier.id, 'firstHourRate', parseFloat(e.target.value) || 0)}
              />
              <Input
                label="Additional Hour Rate (₹)"
                type="number"
                value={tier.additionalHourRate}
                onChange={(e) => handleChange(tier.id, 'additionalHourRate', parseFloat(e.target.value) || 0)}
              />
              <Input
                label="Daily Maximum Cap (₹)"
                type="number"
                value={tier.dailyMaxCap}
                onChange={(e) => handleChange(tier.id, 'dailyMaxCap', parseFloat(e.target.value) || 0)}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4 gap-3">
        <Button size="lg" className="px-8 shadow-md" isLoading={updateMutation.isPending} onClick={handleSave}>
          <span className="material-symbols-outlined text-[20px] mr-2">save</span>
          Save Rate Configurations
        </Button>
      </div>

      {/* T4 Messy Rate Card Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="T4 — Import Messy Rate Card"
      >
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Upload or paste a rate card containing messy values (e.g., <code className="text-primary font-bold">Rs 50/-</code>, <code className="text-primary font-bold">₹30/hr</code>, <code className="text-primary font-bold">80 INR</code>). The system will normalize currency representations into numeric INR and update MongoDB Atlas.
          </p>

          {/* Import Controls Header */}
          <div className="flex items-center justify-between gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-surface-container-high border border-outline-variant/40 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">file_upload</span>
              <span>Upload Rate Card File (.json, .csv)</span>
              <input type="file" accept=".json,.csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => {
                setRawInputText(SAMPLE_MESSY_RATE_CARD);
                setCleanedPreview(null);
                setImportErrors([]);
              }}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
              <span>Load Sample Junk Data</span>
            </button>
          </div>

          {/* Raw Text Input */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Raw Messy Rate Card Input (JSON / CSV / Text)
            </label>
            <textarea
              rows={6}
              value={rawInputText}
              onChange={(e) => {
                setRawInputText(e.target.value);
                setCleanedPreview(null);
                setImportErrors([]);
              }}
              className="w-full p-3 font-mono text-xs bg-surface-container-lowest text-on-surface border border-outline-variant/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Paste rate card data..."
            />
          </div>

          {/* Import Errors Alert */}
          {importErrors.length > 0 && (
            <div className="p-4 bg-error-container/40 border border-error/30 text-on-error-container rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-error">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>Validation & Parsing Error:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pt-1">
                {importErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Banner */}
          {importSuccessMsg && (
            <div className="p-4 bg-secondary-container/40 border border-secondary/30 text-on-secondary-container rounded-2xl text-xs flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
              <span>{importSuccessMsg}</span>
            </div>
          )}

          {/* Cleaned Rate Preview Table */}
          {cleanedPreview && (
            <div className="space-y-2 pt-2 border-t border-outline-variant/30">
              <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                <span>Cleaned & Normalized Rate Preview:</span>
              </h4>

              <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Spot Type</th>
                      <th className="p-2.5">First Hour</th>
                      <th className="p-2.5">Add'l Hour</th>
                      <th className="p-2.5">Daily Max</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-mono">
                    {cleanedPreview.map((t) => (
                      <tr key={t.vehicleType} className="hover:bg-surface-container/50">
                        <td className="p-2.5 font-bold uppercase text-primary">{t.vehicleType}</td>
                        <td className="p-2.5">{formatCurrency(t.firstHourRate)}</td>
                        <td className="p-2.5">{formatCurrency(t.additionalHourRate)}</td>
                        <td className="p-2.5 font-bold">{formatCurrency(t.dailyMaxCap)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!cleanedPreview ? (
              <Button onClick={handleParseRateCard} isLoading={isParsing} className="w-full sm:w-auto">
                <span className="material-symbols-outlined text-[18px]">cleaning_services</span>
                <span>Clean & Preview Rates</span>
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setCleanedPreview(null)}>
                  Edit Input
                </Button>
                <Button onClick={handleConfirmImport} isLoading={isImporting} className="shadow-md">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Confirm & Save to MongoDB</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

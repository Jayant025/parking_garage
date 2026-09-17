import React, { useState } from 'react';
import { useGaragesData } from '../hooks/useParkingQueries';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

export const GaragePage: React.FC = () => {
  const { data: garages, isLoading } = useGaragesData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGarageName, setNewGarageName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  if (isLoading) return <LoadingSkeleton count={3} height="h-36" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            Garage Infrastructure Management
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Multi-facility LPR gate configurations & capacity settings
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-md">
          <span className="material-symbols-outlined text-[20px]">add_location</span>
          Add New Facility
        </Button>
      </div>

      {/* Garage Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {garages?.map((gar) => (
          <Card key={gar.id} className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                </div>
                <div>
                  <h3 className="font-title-sm text-title-sm font-bold text-on-surface">{gar.name}</h3>
                  <span className="font-label-caps text-[10px] text-on-surface-variant">{gar.code}</span>
                </div>
              </div>
              <Badge variant="available">Active</Badge>
            </div>

            <div className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="font-body-sm text-on-surface">{gar.address}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Capacity:</span>
                <span className="font-code-plate font-bold text-on-surface">{gar.totalCapacity} bays</span>
              </div>
              <div className="flex justify-between">
                <span>Configured Levels:</span>
                <span className="font-body-sm font-semibold text-on-surface">
                  {gar.levels.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>API Status:</span>
                <span className="font-label-caps text-secondary font-bold">
                  {gar.apiStatus} ({gar.latencyMs}ms)
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Add Facility */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Garage Facility"
      >
        <div className="space-y-4">
          <Input
            label="Garage Name"
            placeholder="e.g. North Harbor Deck"
            value={newGarageName}
            onChange={(e) => setNewGarageName(e.target.value)}
          />
          <Input
            label="Physical Address"
            placeholder="e.g. 100 Port Street"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <Input label="Capacity Limit" type="number" placeholder="250" />
          <Button
            size="lg"
            className="w-full mt-2"
            onClick={() => {
              setIsAddModalOpen(false);
              setNewGarageName('');
              setNewAddress('');
            }}
          >
            Create Facility
          </Button>
        </div>
      </Modal>
    </div>
  );
};

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">Operator Profile</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Identity & security console settings
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl">
          {user?.name.charAt(0)}
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div>
            <h3 className="font-title-sm text-headline-md font-bold text-on-surface">{user?.name}</h3>
            <span className="font-label-caps text-[11px] text-on-surface-variant">Badge {user?.badgeNumber}</span>
          </div>
          <Badge variant="available">Active Operator</Badge>
        </div>

        <div className="space-y-3 font-body-md text-body-md text-on-surface">
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">Email Address:</span>
            <span className="font-semibold">{user?.email}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-outline-variant/20">
            <span className="text-on-surface-variant">Role:</span>
            <span className="font-title-sm uppercase font-semibold">{user?.role}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-on-surface-variant">Access Level:</span>
            <span className="font-label-caps text-secondary font-bold">LPR Gate Terminal & Billing</span>
          </div>
        </div>

        <Button variant="danger" size="lg" className="w-full mt-4" onClick={logout}>
          Sign Out of Console
        </Button>
      </Card>
    </div>
  );
};

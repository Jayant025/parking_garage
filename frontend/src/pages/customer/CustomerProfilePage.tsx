import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const CustomerProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">person</span>
          <span>Customer Profile</span>
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Manage your customer account details and session security
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/30 space-y-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary font-bold text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">{user?.name}</h2>
            <p className="text-xs text-on-surface-variant font-mono">{user?.email}</p>
            <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
              Customer Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-outline-variant/30">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-1">
            <span className="text-on-surface-variant font-semibold">Member ID Badge:</span>
            <p className="font-mono text-base font-bold text-on-surface">{user?.badgeNumber || '#0000'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-1">
            <span className="text-on-surface-variant font-semibold">Account Role:</span>
            <p className="font-bold text-on-surface uppercase text-sm">CUSTOMER</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">
            Need to update your password? Use the <a href="/forgot-password" className="text-primary font-semibold hover:underline">Forgot Password</a> flow.
          </p>

          <Button onClick={logout} variant="outline" className="w-full sm:w-auto">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

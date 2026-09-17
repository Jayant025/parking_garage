import React from 'react';
import { Card } from '../components/ui/Card';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">System Settings</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Application preferences, LPR terminal settings & theme
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[28px]">settings</span>
        </div>
      </div>

      <Card className="p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div>
            <h3 className="font-title-sm text-title-sm font-bold text-on-surface">Theme Mode</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Toggle complete application Light or Dark visual mode
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div>
            <h3 className="font-title-sm text-title-sm font-bold text-on-surface">LPR Camera Auto-Scan</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Automatically populate plate numbers when gate camera detects ingress
            </p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-title-sm text-title-sm font-bold text-on-surface">API Live Sync Polling</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Refresh bay availability and metrics in background every 15s
            </p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
        </div>
      </Card>
    </div>
  );
};

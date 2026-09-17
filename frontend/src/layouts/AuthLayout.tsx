import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-center items-center p-4 relative">
      {/* Top Bar Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[32px]">local_parking</span>
          </div>
          <h1 className="font-title-sm text-headline-xl font-bold tracking-tight text-on-surface">
            ParkFlow
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Smart Parking Garage Management System
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-xl">
          <Outlet />
        </div>

        <div className="text-center font-label-caps text-[11px] text-on-surface-variant">
          &copy; {new Date().getFullYear()} ParkFlow Enterprise Hub · Version 1.0.0
        </div>
      </div>
    </div>
  );
};

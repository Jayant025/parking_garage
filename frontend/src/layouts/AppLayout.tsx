import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useGaragesData } from '../hooks/useParkingQueries';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { data: garages } = useGaragesData();
  const [selectedGarage, setSelectedGarage] = useState(garages?.[0]?.name || 'Downtown Central');

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Check-In', path: '/check-in', icon: 'login' },
    { label: 'Check-Out', path: '/check-out', icon: 'logout' },
    { label: 'Spots Map', path: '/spots', icon: 'grid_view' },
    { label: 'Plate Search', path: '/search', icon: 'search' },
    { label: 'History', path: '/history', icon: 'history' },
    { label: 'Pricing', path: '/pricing', icon: 'payments' },
    { label: 'Reports', path: '/reports', icon: 'analytics' },
    { label: 'Garage', path: '/garage', icon: 'corporate_fare' },
    { label: 'Customer Support', path: '/support', icon: 'support_agent' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const bottomNavItems = [
    { label: 'Dash', path: '/dashboard', icon: 'dashboard' },
    { label: 'In', path: '/check-in', icon: 'login' },
    { label: 'Out', path: '/check-out', icon: 'logout' },
    { label: 'Spots', path: '/spots', icon: 'grid_view' },
    { label: 'History', path: '/history', icon: 'history' },
  ];

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Desktop Sidebar (lg:flex) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-outline-variant/30 bg-surface-container-lowest fixed inset-y-0 left-0 z-40">
        {/* Sidebar Brand Header */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-outline-variant/30">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[24px]">local_parking</span>
          </div>
          <div className="flex flex-col">
            <span className="font-title-sm text-headline-md leading-tight text-on-surface font-bold tracking-tight">
              ParkFlow
            </span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
              Smart Operator Hub
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-title-sm text-[14px] transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`
              }
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="flex flex-col">
                <span className="font-title-sm text-[13px] text-on-surface font-semibold">{user?.name}</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">{user?.badgeNumber}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-lg hover:bg-surface-container"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Fixed Header */}
        <header className="fixed top-0 inset-x-0 lg:left-64 z-30 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm">
          <div className="h-20 px-4 md:px-6 flex flex-col justify-center gap-1">
            <div className="flex items-center justify-between">
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <span className="font-label-caps text-[11px] text-on-secondary-container uppercase font-semibold">
                  Live Sync
                </span>
                <span className="text-outline text-xs">|</span>
                <span className="font-label-caps text-[11px] text-on-surface-variant tabular-nums">
                  {timeStr}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <ThemeToggle />

                {/* Garage Switcher */}
                <select
                  value={selectedGarage}
                  onChange={(e) => setSelectedGarage(e.target.value)}
                  className="hidden sm:block h-9 px-2.5 rounded-lg bg-surface-container text-on-surface font-label-caps text-[11px] border border-outline-variant/40 focus:outline-none"
                >
                  {garages?.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>

                {/* Notifications */}
                <button
                  aria-label="Notifications"
                  className="w-9 h-9 flex items-center justify-center relative rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />
                </button>
              </div>
            </div>

            {/* Sub-header Title & Breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="font-title-sm text-title-sm text-on-surface capitalize">
                  {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
                </h1>
              </div>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                {selectedGarage} · Active
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 pt-24 pb-24 lg:pb-8 px-4 md:px-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation (< lg) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 pb-safe">
        <div className="flex justify-around items-center h-16 px-1">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider mt-0.5">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export const CustomerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Overview', path: '/customer', icon: 'space_dashboard', exact: true },
    { label: 'Available Spots', path: '/customer/spots', icon: 'local_parking' },
    { label: 'Parking Rates', path: '/customer/pricing', icon: 'payments' },
    { label: 'Support', path: '/customer/support', icon: 'help' },
    { label: 'Profile', path: '/customer/profile', icon: 'person' },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* Customer Top Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[24px]">directions_car</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-sm text-headline-md font-bold text-on-surface leading-tight">
                ParkFlow
              </span>
              <span className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-wider">
                Customer Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-2xl border border-outline-variant/30">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>{timeStr} IST</span>
            </div>

            <ThemeToggle />

            {/* Customer User Info & Logout */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-outline-variant/30">
              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="font-title-sm text-xs font-semibold text-on-surface">{user?.name}</span>
                <span className="text-[10px] text-on-surface-variant">Customer Account</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-on-surface-variant hover:text-error hover:bg-surface-container rounded-xl transition-colors"
                title="Log Out"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
                  isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-label-caps text-[10px] tracking-wider mt-0.5">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

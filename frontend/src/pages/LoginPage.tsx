import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [loginMode, setLoginMode] = useState<'operator' | 'customer'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loggedUser = await login(email, password);
      const userRole = (loggedUser.role || '').toLowerCase();

      // Secure role-based navigation
      if (userRole === 'customer' || userRole === 'user') {
        navigate('/customer');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || 'Login failed. Please check credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Login Mode Selector Tabs */}
      <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant/30">
        <button
          type="button"
          onClick={() => {
            setLoginMode('customer');
            setError('');
          }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            loginMode === 'customer'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span>Customer Login</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setLoginMode('operator');
            setError('');
          }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            loginMode === 'operator'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          <span>Operator Login</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
            {loginMode === 'operator' ? 'Operator Sign In' : 'Customer Sign In'}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            {loginMode === 'operator'
              ? 'Administrative access for system owner & garage managers'
              : 'Access your parking portal, available spots & support'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl font-body-sm text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <Input
          label={loginMode === 'operator' ? 'Operator Email' : 'Customer Email'}
          type="email"
          placeholder={loginMode === 'operator' ? 'admin@parkflow.io' : 'customer@parkflow.io'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex justify-between items-center text-[12px] font-body-sm">
          <label className="flex items-center gap-1.5 text-on-surface-variant cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-outline-variant" />
            <span>Remember Me</span>
          </label>
          <Link to="/forgot-password" className="text-primary hover:underline font-semibold">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full h-12 shadow-md" isLoading={isLoading}>
          {loginMode === 'operator' ? 'Sign In as Operator' : 'Sign In as Customer'}
        </Button>

        <div className="text-center text-[13px] font-body-sm text-on-surface-variant pt-2">
          New Customer?{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Register Customer Account
          </Link>
        </div>
      </form>
    </div>
  );
};

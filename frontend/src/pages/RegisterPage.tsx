import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      // New user registration creates Customer account -> route to customer portal
      navigate('/customer');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
          Create Customer Account
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Register to view available parking spots, check rates, and submit support tickets
        </p>
      </div>

      {error && (
        <div className="p-3 bg-error-container text-on-error-container rounded-xl font-body-sm text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Full Name"
        placeholder="Rahul Sharma"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Customer Email"
        type="email"
        placeholder="rahul@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Min. 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" size="lg" className="w-full h-12 shadow-md" isLoading={isLoading}>
        Create Account & Enter Portal
      </Button>

      <div className="text-center text-[13px] font-body-sm text-on-surface-variant pt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </form>
  );
};

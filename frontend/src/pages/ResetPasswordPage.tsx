import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { parkingService } from '../services/parkingService';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Password reset token is required.');
      return;
    }

    if (password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await parkingService.resetPassword(token.trim(), password);
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to reset password.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
          Set New Password
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Enter your reset token and your new password
        </p>
      </div>

      {error && (
        <div className="p-3 bg-error-container text-on-error-container rounded-xl font-body-sm text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="text-center space-y-4 p-5 bg-surface-container rounded-2xl border border-outline-variant/30">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[28px]">check_circle</span>
          </div>

          <p className="font-body-sm text-sm text-on-surface">
            Your password has been successfully updated in MongoDB Atlas. You can now log in with your new password.
          </p>

          <Button onClick={() => navigate('/login')} size="lg" className="w-full h-12 shadow-md">
            Sign In Now
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {!tokenFromUrl && (
            <Input
              label="Reset Token"
              placeholder="Paste your 64-char reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" size="lg" className="w-full h-12 shadow-md" isLoading={isLoading}>
            Update Password
          </Button>

          <div className="text-center text-[13px] font-body-sm">
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Cancel & Return to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

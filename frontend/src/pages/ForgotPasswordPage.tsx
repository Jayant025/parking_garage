import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { parkingService } from '../services/parkingService';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ message: string; resetToken?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await parkingService.forgotPassword(email);
      setSuccessInfo(res);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to process request.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-title-sm text-headline-md font-bold text-on-surface">
          Forgot Password
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Enter your account email to receive a password reset token
        </p>
      </div>

      {error && (
        <div className="p-3 bg-error-container text-on-error-container rounded-xl font-body-sm text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {successInfo ? (
        <div className="text-center space-y-4 p-5 bg-surface-container rounded-2xl border border-outline-variant/30">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
          </div>

          <p className="font-body-sm text-sm text-on-surface">
            {successInfo.message}
          </p>

          {successInfo.resetToken && (
            <div className="p-3 bg-surface-container-highest rounded-xl text-left font-mono text-xs space-y-1">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                Dev Mode Token:
              </span>
              <p className="break-all font-semibold text-primary">{successInfo.resetToken}</p>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            {successInfo.resetToken && (
              <Link
                to={`/reset-password?token=${encodeURIComponent(successInfo.resetToken)}`}
                className="w-full py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:opacity-95 transition-opacity"
              >
                Proceed to Reset Password
              </Link>
            )}
            <Link to="/login" className="text-sm text-on-surface-variant hover:text-on-surface font-medium">
              Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Email"
            type="email"
            placeholder="registered-user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" size="lg" className="w-full h-12 shadow-md" isLoading={isLoading}>
            Send Reset Token
          </Button>

          <div className="text-center text-[13px] font-body-sm">
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

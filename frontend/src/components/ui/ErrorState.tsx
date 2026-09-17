import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected error occurred while communicating with the parking API.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-error-container/30 border border-error/20 rounded-xl my-4 text-center">
      <span className="material-symbols-outlined text-error text-[32px] mb-2">wifi_off</span>
      <h4 className="font-title-sm text-title-sm text-error mb-1">API Communication Error</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mb-3">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <span className="material-symbols-outlined text-[16px] mr-1">refresh</span>
          Retry Request
        </Button>
      )}
    </div>
  );
};

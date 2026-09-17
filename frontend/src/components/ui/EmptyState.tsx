import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'inbox',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest border border-outline-variant/30 rounded-xl my-4">
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <h3 className="font-title-sm text-title-sm text-on-surface mb-1">{title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mb-4">
        {description}
      </p>
      {action}
    </div>
  );
};

import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { CALL_STATUSES } from '@/config/statusRules';
import { cn } from '@/lib/utils';

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  error,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-foreground">
        Call Status <span className="text-destructive">*</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full h-12 min-touch-target appearance-none rounded-lg border bg-background px-4 pr-10 text-base',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'transition-colors duration-200',
            error
              ? 'border-destructive focus:ring-destructive'
              : 'border-input hover:border-primary/50'
          )}
        >
          <option value="">Select status...</option>
          {CALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive animate-fade-in">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

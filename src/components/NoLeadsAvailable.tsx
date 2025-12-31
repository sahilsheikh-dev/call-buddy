import React from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoLeadsAvailableProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const NoLeadsAvailable: React.FC<NoLeadsAvailableProps> = ({
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
      <div className="rounded-full bg-success/10 p-4 mb-4">
        <CheckCircle2 className="h-12 w-12 text-success" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        All Caught Up!
      </h2>
      <p className="text-muted-foreground mb-6 max-w-xs">
        No more leads available at the moment. Check back later for new leads.
      </p>
      <Button
        onClick={onRefresh}
        disabled={isLoading}
        className="min-touch-target"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh Leads
      </Button>
    </div>
  );
};

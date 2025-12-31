import React from 'react';
import { LogOut, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { APP_CONFIG } from '@/config/app';

interface HeaderProps {
  remainingLeads?: number;
}

export const Header: React.FC<HeaderProps> = ({ remainingLeads }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border card-shadow">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Phone className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">{APP_CONFIG.appName}</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Leads Counter */}
          {remainingLeads !== undefined && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-sm">
              <span className="font-medium text-foreground">{remainingLeads}</span>
              <span className="text-muted-foreground">leads left</span>
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.username}</span>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="min-touch-target text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1.5">Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile Leads Counter */}
      {remainingLeads !== undefined && (
        <div className="sm:hidden flex items-center justify-center gap-1.5 px-4 pb-2 text-sm">
          <span className="font-medium text-foreground">{remainingLeads}</span>
          <span className="text-muted-foreground">leads remaining</span>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { MapPin, Building2, Phone, Globe } from 'lucide-react';
import { Lead } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeadCardProps {
  lead: Lead;
  className?: string;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, className }) => {
  const formatPhoneNumber = (phone: string): string => {
    // Clean and format for display
    const cleaned = phone.replace(/[^0-9+]/g, '');
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  };

  const phoneNumber = formatPhoneNumber(lead.mobile_number);

  return (
    <div className={cn('bg-card rounded-xl card-shadow-lg p-5 animate-fade-in', className)}>
      {/* Niche Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Building2 className="h-3.5 w-3.5" />
          {lead.niche || 'General'}
        </span>
      </div>

      {/* Location Info */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span className="text-sm">{lead.country || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{lead.state || 'N/A'}</span>
        </div>
      </div>

      {/* Phone Number - Large and Tappable */}
      <div className="bg-secondary/50 rounded-lg p-4 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Mobile Number
        </p>
        <p className="text-xl font-semibold text-foreground font-mono">
          {phoneNumber}
        </p>
      </div>

      {/* Call Button */}
      <Button
        asChild
        size="lg"
        className="w-full h-14 text-lg font-semibold min-touch-target bg-success hover:bg-success/90 text-success-foreground"
      >
        <a href={`tel:${phoneNumber}`}>
          <Phone className="h-5 w-5 mr-2" />
          Call Now
        </a>
      </Button>
    </div>
  );
};

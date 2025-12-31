import React from "react";
import {
  Phone,
  Globe,
  MapPin,
  Star,
  ExternalLink,
  Clock,
  Info,
} from "lucide-react";
import { Lead } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  className?: string;
}

/* ---------- utils ---------- */

const NA = "NA";

const normalizeValue = (value: any): string => {
  if (value === null || value === undefined) return NA;
  if (typeof value === "string" && value.trim() === "") return NA;
  return String(value);
};

const formatJSON = (value: any): string => {
  if (!value) return NA;

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    // Array → each item on new line
    if (Array.isArray(parsed)) {
      return parsed.length ? parsed.join("\n") : NA;
    }

    // Object → key: value per line
    if (typeof parsed === "object") {
      const entries = Object.entries(parsed);
      if (!entries.length) return NA;

      return entries.map(([key, val]) => `${key}: ${val}`).join("\n");
    }

    return String(parsed);
  } catch {
    // Not valid JSON, return as-is
    return String(value);
  }
};

const formatUrl = (url?: string): string | null => {
  if (!url || url.trim() === "") return null;
  return url.startsWith("http") ? url : `https://${url}`;
};

/* ---------- UI helpers ---------- */

const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
      {icon}
      <span>{title}</span>
    </div>
    <div className="space-y-1 text-sm">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex justify-between gap-4 my-2">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right break-all">{normalizeValue(value)}</span>
  </div>
);

const JsonRow = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right break-all whitespace-pre-line">
      {formatJSON(value)}
    </span>
  </div>
);

const LinkRow = ({ label, url }: { label: string; url?: string }) => {
  const formatted = formatUrl(url);

  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      {formatted ? (
        <a
          href={formatted}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary break-all"
        >
          {formatted} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="text-right break-all">{NA}</span>
      )}
    </div>
  );
};

/* ---------- main ---------- */

export const LeadCard: React.FC<LeadCardProps> = ({ lead, className }) => {
  const formatPhone = (phone?: string) => {
    if (!phone) return NA;
    const cleaned = phone.replace(/[^0-9+]/g, "");
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  };

  const phoneNumber = formatPhone(lead.phone);

  return (
    <div
      className={cn(
        "bg-card rounded-xl card-shadow-lg p-5 space-y-6 animate-fade-in",
        className
      )}
    >
      {/* CALL ACTION */}
      <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
        <Button
          asChild={phoneNumber !== NA}
          size="lg"
          disabled={phoneNumber === NA}
          className="w-full h-14 text-lg font-semibold bg-success hover:bg-success/90 text-success-foreground disabled:opacity-60"
        >
          {phoneNumber !== NA ? (
            <a href={`tel:${phoneNumber}`}>
              <Phone className="h-5 w-5 mr-2" />
              {phoneNumber} – Call Now
            </a>
          ) : (
            <span>
              <Phone className="h-5 w-5 mr-2" />
              NA
            </span>
          )}
        </Button>
      </div>

      {/* BUSINESS */}
      <Section title="Business Information" icon={<Info className="h-4 w-4" />}>
        <Row label="Name" value={lead.name} />
        <Row label="Title" value={lead.title} />
        <Row label="Email" value={lead.email} />
        <Row label="Type" value={lead.type} />
        <Row label="Price" value={lead.price} />
      </Section>

      <hr />

      {/* QUERY */}
      <Section title="Search Query" icon={<Globe className="h-4 w-4" />}>
        <Row label="Niche" value={lead.query_niche} />
        <Row label="Country" value={lead.query_country} />
        <Row label="State" value={lead.query_state} />
        <Row label="City" value={lead.query_city} />
        <Row label="Area" value={lead.query_area} />
        <Row label="Landmark" value={lead.query_landmark} />
        <Row label="Pincode" value={lead.query_pincode} />
        <Row label="Added On" value={lead.added_date_time} />
      </Section>

      <hr />

      {/* LOCATION */}
      <Section title="Location" icon={<MapPin className="h-4 w-4" />}>
        <Row label="Address" value={lead.address} />
        <Row label="Latitude" value={lead.latitude} />
        <Row label="Longitude" value={lead.longitude} />
        <JsonRow label="GPS Coordinates" value={lead.gps_coordinates} />
        <Row label="Place ID" value={lead.place_id} />
      </Section>

      <hr />

      {/* ONLINE */}
      <Section
        title="Online Presence"
        icon={<ExternalLink className="h-4 w-4" />}
      >
        <LinkRow label="Website" url={lead.website} />
        <LinkRow label="Clean URL" url={lead.clean_url} />
        <LinkRow label="Facebook" url={lead.facebook} />
        <LinkRow label="Instagram" url={lead.instagram} />
        <LinkRow label="YouTube" url={lead.youtube} />
        <LinkRow label="TikTok" url={lead.tiktok} />
        <LinkRow label="Twitter" url={lead.twitter} />
        <LinkRow label="LinkedIn" url={lead.linkedin} />
        <LinkRow label="Pinterest" url={lead.pinterest} />
        <LinkRow label="Reddit" url={lead.reddit} />
      </Section>

      <hr />

      {/* RATINGS */}
      <Section title="Ratings" icon={<Star className="h-4 w-4" />}>
        <Row label="Rating" value={lead.rating} />
        <Row label="Rating Count" value={lead.rating_count} />
        <Row label="Reviews" value={lead.reviews} />
        <LinkRow label="Reviews Link" url={lead.reviews_link} />
        <LinkRow label="Photos Link" url={lead.photos_link} />
      </Section>

      <hr />

      {/* HOURS */}
      <Section title="Operating Hours" icon={<Clock className="h-4 w-4" />}>
        <JsonRow label="Hours" value={lead.hours} />
        <JsonRow label="Operating Hours" value={lead.operating_hours} />
        <LinkRow label="Book Online" url={lead.book_online} />
      </Section>

      <hr />

      {/* GOOGLE META */}
      <Section title="Google Metadata">
        <Row label="Position" value={lead.position} />
        <Row label="Data ID" value={lead.data_id} />
        <Row label="Data CID" value={lead.data_cid} />
        <Row label="Place ID Search" value={lead.place_id_search} />
        <JsonRow label="Types" value={lead.types} />
        <Row label="Description" value={lead.description} />
        <LinkRow label="Thumbnail" url={lead.thumbnail} />
      </Section>
    </div>
  );
};

import React from "react";
import {
  Phone,
  Globe,
  MapPin,
  Star,
  ExternalLink,
  Clock,
  Info,
  FileText,
  Database,
  Map,
} from "lucide-react";
import { Lead } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------- constants -------------------------------- */

const NA = "NA";

/* -------------------------------- utils -------------------------------- */

const normalize = (v: any): string => {
  if (v === null || v === undefined) return NA;
  if (typeof v === "string" && v.trim() === "") return NA;
  return String(v);
};

const safeJSON = (value: any): any | null => {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const formatPhone = (phone?: string) => {
  if (!phone) return NA;
  const cleaned = phone.replace(/[^0-9+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
};

const formatUrl = (url?: string) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `https://${url}`;
};

/* -------------------------------- UI atoms -------------------------------- */

const Section = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <section className="space-y-4">
    <h3 className="flex items-center gap-2 font-semibold text-base">
      <Icon className="h-4 w-4" />
      {title}
    </h3>
    {children}
  </section>
);

const DataBlock = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="space-y-0.5">
    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="text-sm break-words whitespace-pre-wrap">{value || NA}</div>
  </div>
);

const LinkBlock = ({ url }: { url?: string }) => {
  const formatted = formatUrl(url);
  if (!formatted) return <span>{NA}</span>;
  return (
    <a
      href={formatted}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary break-all"
    >
      {formatted}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
};

/* -------------------------------- smart renderers -------------------------------- */

const TypesBlock = ({ value }: { value: string }) => {
  const parsed = safeJSON(value);
  if (Array.isArray(parsed)) return <span>{parsed.join(", ")}</span>;
  return <span>{normalize(value)}</span>;
};

const HoursBlock = ({ value }: { value: string }) => {
  const parsed = safeJSON(value);

  if (Array.isArray(parsed)) {
    return (
      <ul className="list-disc ml-4 space-y-1">
        {parsed.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    );
  }

  if (parsed?.weekday_text) {
    return (
      <ul className="list-disc ml-4 space-y-1">
        {parsed.weekday_text.map((v: string, i: number) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    );
  }

  return <span>{normalize(value)}</span>;
};

const RatingBlock = ({ rating, count }: { rating: string; count: string }) => {
  if (!rating) return <span>{NA}</span>;
  return (
    <div className="flex items-center gap-2">
      <Star className="h-4 w-4 text-yellow-500" />
      <span className="font-semibold">{rating}</span>
      {count && (
        <span className="text-muted-foreground text-sm">({count})</span>
      )}
    </div>
  );
};

const ReviewsBlock = ({ value }: { value: string }) => {
  const parsed = safeJSON(value);
  if (!Array.isArray(parsed)) return <span>{NA}</span>;

  return (
    <div className="space-y-3">
      {parsed.slice(0, 3).map((r, i) => (
        <div key={i} className="border rounded-md p-3 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="font-semibold">{r.rating}</span>
            <span className="text-muted-foreground">
              {r.relative_time_description}
            </span>
          </div>
          <div className="text-xs font-medium">{r.author_name}</div>
          <div className="text-sm text-muted-foreground">{r.text}</div>
        </div>
      ))}
    </div>
  );
};

/* -------------------------------- main component -------------------------------- */

export const LeadCard: React.FC<{
  lead: Lead;
  className?: string;
}> = ({ lead, className }) => {
  const phone = formatPhone(lead.phone);

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-4 sm:p-6 space-y-8 max-w-full",
        className
      )}
    >
      {/* CALL */}
      <Button
        asChild={phone !== NA}
        disabled={phone === NA}
        className="w-full h-14 text-lg font-semibold bg-success hover:bg-success/90 text-success-foreground disabled:opacity-60"
      >
        {phone !== NA ? (
          <a href={`tel:${phone}`} className="flex items-center justify-center">
            <Phone className="h-5 w-5 mr-2" />
            {phone}
          </a>
        ) : (
          <span>NA</span>
        )}
      </Button>

      {/* GOOGLE MAPS */}
      <Button
        asChild={lead.google_maps_url !== NA}
        disabled={lead.google_maps_url === NA}
        className="w-full h-14 text-base font-semibold"
      >
        {lead.google_maps_url !== NA ? (
          <a
            href={`${lead.google_maps_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <Map className="h-5 w-5 mr-2" />
            View on Google Maps
          </a>
        ) : (
          <span>NA</span>
        )}
      </Button>

      {/* BUSINESS */}
      <Section title="Business Info" icon={Info}>
        <DataBlock label="Title" value={normalize(lead.title)} />
        <DataBlock label="Name" value={normalize(lead.name)} />
        <DataBlock label="Email" value={normalize(lead.email)} />
        <DataBlock
          label="Type"
          value={<TypesBlock value={lead.types || lead.type} />}
        />
        <DataBlock label="Description" value={normalize(lead.description)} />
        <DataBlock label="Address" value={normalize(lead.address)} />
        <DataBlock
          label="Coordinates"
          value={`${normalize(lead.latitude)}, ${normalize(lead.longitude)}`}
        />
      </Section>

      {/* RATINGS */}
      <Section title="Ratings & Reviews" icon={Star}>
        <RatingBlock rating={lead.rating} count={lead.rating_count} />
        <ReviewsBlock value={lead.reviews} />
      </Section>

      {/* HOURS */}
      <Section title="Operating Hours" icon={Clock}>
        <HoursBlock value={lead.hours || lead.operating_hours} />
      </Section>

      {/* ONLINE */}
      <Section title="Online Presence" icon={Globe}>
        <DataBlock label="Website" value={<LinkBlock url={lead.clean_url} />} />
        <DataBlock label="Facebook" value={<LinkBlock url={lead.facebook} />} />
        <DataBlock
          label="Instagram"
          value={<LinkBlock url={lead.instagram} />}
        />
        <DataBlock label="YouTube" value={<LinkBlock url={lead.youtube} />} />
        <DataBlock label="Twitter" value={<LinkBlock url={lead.twitter} />} />
        <DataBlock label="LinkedIn" value={<LinkBlock url={lead.linkedin} />} />
        <DataBlock
          label="Pinterest"
          value={<LinkBlock url={lead.pinterest} />}
        />
        <DataBlock label="Reddit" value={<LinkBlock url={lead.reddit} />} />
      </Section>

      {/* QUERY */}
      <Section title="Query Metadata" icon={Database}>
        <DataBlock label="Niche" value={lead.query_niche} />
        <DataBlock label="Country" value={lead.query_country} />
        <DataBlock label="State" value={lead.query_state} />
        <DataBlock label="City" value={lead.query_city} />
        <DataBlock label="Area" value={lead.query_area} />
        <DataBlock label="Landmark" value={lead.query_landmark} />
        <DataBlock label="Pincode" value={lead.query_pincode} />
        <DataBlock label="Added At" value={lead.added_date_time} />
      </Section>

      {/* SYSTEM */}
      <Section title="System Status" icon={FileText}>
        <DataBlock label="Website Status" value={lead.website_status} />
        <DataBlock label="Fetch Status" value={lead.website_fetch_status} />
        <DataBlock label="Enrichment Status" value={lead.enrichment_status} />
        <DataBlock label="Caller" value={lead.caller_username} />
        <DataBlock label="Call Time" value={lead.calling_date_time} />
        <DataBlock
          label="Recording"
          value={<LinkBlock url={lead.call_recording_url} />}
        />
        <DataBlock label="Status" value={lead.status} />
        <DataBlock label="Comments" value={lead.comment} />
      </Section>
    </div>
  );
};

export interface User {
  username: string;
  password: string;
  role: "caller" | "admin";
}

export interface Lead {
  rowIndex: number;

  // Call workflow
  status: string;
  comment: string;
  caller_username: string;
  calling_date_time: string;
  call_recording_url: string;

  // Query details
  query_niche: string;
  query_country: string;
  query_state: string;
  query_city: string;
  query_area: string;
  query_landmark: string;
  query_pincode: string;
  added_date_time: string;

  // Identity
  title: string;
  name: string;
  email: string;
  phone: string;

  // Web presence
  clean_url: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  twitter: string;
  linkedin: string;
  pinterest: string;
  reddit: string;

  // Business metadata
  rating: string;
  rating_count: string;
  reviews: string;
  type: string;
  address: string;
  latitude: string;
  longitude: string;

  // Google data
  place_id: string;
  google_maps_url: string;
  reviews_link: string;
  photos_link: string;
  gps_coordinates: string;
  types: string;
  description: string;
  hours: string;
  operating_hours: string;
  thumbnail: string;
  book_online: string;
  website_status: string;
  website_fetch_status: string;
  enrichment_status: string;
}

export interface CallFormData {
  status: string;
  comment: string;
  audioFile: File | null;
}

export interface GoogleConfig {
  sheetId: string;
  sheetName: string;
  driveFolderId: string;
  apiKey: string;
}

export interface AppConfig {
  appName: string;
  version: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

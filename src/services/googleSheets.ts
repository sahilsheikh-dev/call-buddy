import { Lead } from "@/types";
import { GOOGLE_CONFIG } from "@/config/google";
import { SHEET_COLUMNS, TIMEOUTS } from "@/config/app";

const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const SHEET_WEBHOOK_DEPLOYMENT_ID = import.meta.env
  .VITE_SHEET_WEBHOOK_DEPLOYMENT_ID;

/**
 * Fetch all rows from the Google Sheet
 */
export const fetchSheetData = async (): Promise<Lead[]> => {
  const { sheetId, sheetName, apiKey } = GOOGLE_CONFIG;

  if (!sheetId || sheetId === "YOUR_SHEET_ID_HERE") {
    throw new Error(
      "Google Sheet ID not configured. Please update src/config/google.ts"
    );
  }

  const url = `${SHEETS_API_BASE}/${sheetId}/values/${sheetName}?key=${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.SHEET_FETCH);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Failed to fetch sheet data: ${response.status}`
      );
    }

    const data = await response.json();
    const rows = data.values || [];

    // Skip header row (index 0)
    return rows.slice(1).map((row, index) => ({
      rowIndex: index + 2,

      // Call workflow
      status: row[0] || "",
      comment: row[1] || "",
      caller_username: row[2] || "",
      calling_date_time: row[3] || "",
      call_recording_url: row[4] || "",
      call_recording_length: row[5] || "",

      // Query details
      query_niche: row[6] || "",
      query_country: row[7] || "",
      query_state: row[8] || "",
      query_city: row[9] || "",
      query_area: row[10] || "",
      query_landmark: row[11] || "",
      query_pincode: row[12] || "",
      added_date_time: row[13] || "",

      // Identity
      title: row[14] || "",
      name: row[15] || "",
      email: row[16] || "",
      phone: row[17] || "",

      // Social / web
      clean_url: row[18] || "",
      facebook: row[19] || "",
      instagram: row[20] || "",
      youtube: row[21] || "",
      tiktok: row[22] || "",
      twitter: row[23] || "",
      linkedin: row[24] || "",
      pinterest: row[25] || "",
      reddit: row[26] || "",

      // Business metadata
      rating: row[27] || "",
      rating_count: row[28] || "",
      reviews: row[29] || "",
      type: row[30] || "",
      types: row[31] || "",
      address: row[32] || "",
      latitude: row[33] || "",
      longitude: row[34] || "",

      // Google data
      place_id: row[35] || "",
      google_maps_url: row[36] || "",
      reviews_link: row[37] || "",
      photos_link: row[38] || "",
      gps_coordinates: row[39] || "",
      description: row[40] || "",
      hours: row[41] || "",
      operating_hours: row[42] || "",
      thumbnail: row[43] || "",
      book_online: row[44] || "",

      // Status flags
      website_status: row[45] || "",
      website_fetch_status: row[46] || "",
      enrichment_status: row[47] || "",
    }));
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Request timed out. Please check your internet connection."
      );
    }
    throw error;
  }
};

/**
 * Update a specific row in the Google Sheet
 */
export const updateSheetRow = async (
  rowIndex: number,
  status: string,
  comment: string,
  callerUsername: string,
  recordingUrl: string | null,
  recordingLength: string
): Promise<void> => {
  const response = await fetch(
    `https://script.google.com/macros/s/${
      import.meta.env.VITE_SHEET_WEBHOOK_DEPLOYMENT_ID
    }/exec`,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        rowIndex,
        status,
        comment,
        callerUsername,
        recordingUrl:
          recordingUrl && recordingUrl.trim() !== "" ? recordingUrl : "NA",
        recordingLength,
      }),
      redirect: "follow",
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Failed to update lead");
  }
};

/**
 * Get the first lead with empty status
 */
export const getNextAvailableLead = (leads: Lead[]): Lead | null => {
  return (
    leads.find((lead) => !lead.status || lead.status.trim() === "") || null
  );
};

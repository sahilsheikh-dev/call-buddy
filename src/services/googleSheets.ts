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

      // Query details
      query_niche: row[5] || "",
      query_country: row[6] || "",
      query_state: row[7] || "",
      query_city: row[8] || "",
      query_area: row[9] || "",
      query_landmark: row[10] || "",
      query_pincode: row[11] || "",
      added_date_time: row[12] || "",

      // Identity
      title: row[13] || "",
      name: row[14] || "",
      email: row[15] || "",
      phone: row[16] || "",

      // Social / web
      clean_url: row[17] || "",
      facebook: row[18] || "",
      instagram: row[19] || "",
      youtube: row[20] || "",
      tiktok: row[21] || "",
      twitter: row[22] || "",
      linkedin: row[23] || "",
      pinterest: row[24] || "",
      reddit: row[25] || "",

      // Business metadata
      rating: row[26] || "",
      rating_count: row[27] || "",
      reviews: row[28] || "",
      type: row[29] || "",
      types: row[30] || "",
      address: row[31] || "",
      latitude: row[32] || "",
      longitude: row[33] || "",

      // Google data
      place_id: row[34] || "",
      google_maps_url: row[35] || "",
      reviews_link: row[36] || "",
      photos_link: row[37] || "",
      gps_coordinates: row[38] || "",
      description: row[39] || "",
      hours: row[40] || "",
      operating_hours: row[41] || "",
      thumbnail: row[42] || "",
      book_online: row[43] || "",

      // Status flags
      website_status: row[44] || "",
      website_fetch_status: row[45] || "",
      enrichment_status: row[46] || "",
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
  recordingUrl: string | null
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

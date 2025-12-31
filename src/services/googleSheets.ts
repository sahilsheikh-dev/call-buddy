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

      status: row[0] || "",
      call_recording_url: row[1] || "",
      comment: row[2] || "",
      caller_username: row[3] || "",
      calling_date_time: row[4] || "",

      query_niche: row[5] || "",
      query_country: row[6] || "",
      query_state: row[7] || "",
      query_city: row[8] || "",
      query_area: row[9] || "",
      query_landmark: row[10] || "",
      query_pincode: row[11] || "",
      added_date_time: row[12] || "",

      title: row[13] || "",
      email: row[14] || "",
      name: row[15] || "",
      phone: row[16] || "",

      clean_url: row[17] || "",
      website: row[18] || "",
      facebook: row[19] || "",
      instagram: row[20] || "",
      youtube: row[21] || "",
      tiktok: row[22] || "",
      twitter: row[23] || "",
      linkedin: row[24] || "",
      pinterest: row[25] || "",
      reddit: row[26] || "",

      rating: row[27] || "",
      rating_count: row[28] || "",
      reviews: row[29] || "",
      type: row[30] || "",
      address: row[31] || "",
      latitude: row[32] || "",
      longitude: row[33] || "",
      price: row[34] || "",

      place_id: row[35] || "",
      position: row[36] || "",
      data_id: row[37] || "",
      data_cid: row[38] || "",
      reviews_link: row[39] || "",
      photos_link: row[40] || "",
      gps_coordinates: row[41] || "",
      place_id_search: row[42] || "",
      types: row[43] || "",
      description: row[44] || "",
      hours: row[45] || "",
      operating_hours: row[46] || "",
      thumbnail: row[47] || "",
      book_online: row[48] || "",
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

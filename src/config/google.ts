import { GoogleConfig } from "@/types";

/**
 * Google API Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Cloud Project at https://console.cloud.google.com
 * 2. Enable Google Sheets API and Google Drive API
 * 3. Create an API Key (for Sheets) and OAuth 2.0 credentials (for Drive uploads)
 * 4. Set up your Google Sheet with these columns:
 *    - niche, country, state, mobile_number, status, comment,
 *    - caller_username, calling_date_time, call_recording_url
 * 5. Create a Google Drive folder for audio uploads and get its ID
 * 6. Replace the placeholder values below with your actual IDs
 */
export const GOOGLE_CONFIG: GoogleConfig = {
  // The ID from your Google Sheet URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
  sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE",

  // The name of the sheet tab (usually "Sheet1")
  sheetName: import.meta.env.VITE_GOOGLE_SHEET_NAME || "Sheet1",

  // The ID from your Google Drive folder URL
  driveFolderId:
    import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID || "YOUR_DRIVE_FOLDER_ID_HERE",

  // Your Google API Key
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_API_KEY_HERE",
};

import { Lead } from '@/types';
import { GOOGLE_CONFIG } from '@/config/google';
import { SHEET_COLUMNS, TIMEOUTS } from '@/config/app';

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Fetch all rows from the Google Sheet
 */
export const fetchSheetData = async (): Promise<Lead[]> => {
  const { sheetId, sheetName, apiKey } = GOOGLE_CONFIG;
  
  if (!sheetId || sheetId === 'YOUR_SHEET_ID_HERE') {
    throw new Error('Google Sheet ID not configured. Please update src/config/google.ts');
  }

  const url = `${SHEETS_API_BASE}/${sheetId}/values/${sheetName}?key=${apiKey}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.SHEET_FETCH);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Failed to fetch sheet data: ${response.status}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    // Skip header row (index 0)
    return rows.slice(1).map((row: string[], index: number) => ({
      rowIndex: index + 2, // +2 because we skip header and Sheets uses 1-based indexing
      niche: row[SHEET_COLUMNS.NICHE] || '',
      country: row[SHEET_COLUMNS.COUNTRY] || '',
      state: row[SHEET_COLUMNS.STATE] || '',
      mobile_number: row[SHEET_COLUMNS.MOBILE_NUMBER] || '',
      status: row[SHEET_COLUMNS.STATUS] || '',
      comment: row[SHEET_COLUMNS.COMMENT] || '',
      caller_username: row[SHEET_COLUMNS.CALLER_USERNAME] || '',
      calling_date_time: row[SHEET_COLUMNS.CALLING_DATE_TIME] || '',
      call_recording_url: row[SHEET_COLUMNS.CALL_RECORDING_URL] || '',
    }));
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
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
  recordingUrl: string
): Promise<void> => {
  const { sheetId, sheetName, apiKey } = GOOGLE_CONFIG;
  
  const callingDateTime = new Date().toISOString();
  
  // Update columns E through I (status, comment, caller_username, calling_date_time, call_recording_url)
  const range = `${sheetName}!E${rowIndex}:I${rowIndex}`;
  const url = `${SHEETS_API_BASE}/${sheetId}/values/${range}?valueInputOption=RAW&key=${apiKey}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.SHEET_UPDATE);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[status, comment, callerUsername, callingDateTime, recordingUrl]],
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Failed to update sheet: ${response.status}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Update timed out. Please try again.');
    }
    throw error;
  }
};

/**
 * Get the first lead with empty status
 */
export const getNextAvailableLead = (leads: Lead[]): Lead | null => {
  return leads.find((lead) => !lead.status || lead.status.trim() === '') || null;
};

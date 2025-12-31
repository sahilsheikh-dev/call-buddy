import { AppConfig } from '@/types';

/**
 * Application configuration
 */
export const APP_CONFIG: AppConfig = {
  appName: 'CallFlow CRM',
  version: '1.0.0',
};

/**
 * Sheet column mapping (0-indexed)
 * Update these if your sheet has different column order
 */
export const SHEET_COLUMNS = {
  NICHE: 0,
  COUNTRY: 1,
  STATE: 2,
  MOBILE_NUMBER: 3,
  STATUS: 4,
  COMMENT: 5,
  CALLER_USERNAME: 6,
  CALLING_DATE_TIME: 7,
  CALL_RECORDING_URL: 8,
} as const;

/**
 * API request timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  SHEET_FETCH: 15000,
  SHEET_UPDATE: 15000,
  DRIVE_UPLOAD: 60000,
};

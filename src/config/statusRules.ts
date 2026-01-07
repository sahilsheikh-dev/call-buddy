/**
 * Status options for call outcomes
 * These are the possible statuses a caller can assign to a lead
 */
export const CALL_STATUSES = [
  "Abusive",
  "Already have a Website",
  "Answering Machine (Sent to Message)",
  "Appointment Set",
  "Blank Call (No Response)",
  "Busy Tone",
  "Call Back",
  "Callback Requested",
  "Concerned Person Not Available",
  "Customer Busy",
  "Customer Hung Up",
  "Disconnected Number",
  "Do Not Call",
  "Follow Up",
  "Hard Reject",
  "In Future",
  "Incomplete",
  "Interested",
  "My Call Back",
  "No Answer",
  "Not Eligible",
  "Not Interested",
  "Receptionist",
  "Repeated Number",
  "Robot / Automated",
  "Sale Made",
  "Voicemail Left",
  "Vulnerable Customer",
  "Wrong Number",
] as const;

export type CallStatus = (typeof CALL_STATUSES)[number];

/**
 * Statuses that do NOT require audio upload
 * For these statuses, the audio file is optional
 */
export const OPTIONAL_AUDIO_STATUSES: string[] = [
  "Blank Call (No Response)",
  "Busy Tone",
  "Disconnected Number",
  "No Answer",
  "Wrong Number",
  "Repeated Number",
  "Robot / Automated",
  "Answering Machine (Sent to Message)",
];

/**
 * Check if audio is required for a given status
 */
export const isAudioRequired = (status: string): boolean => {
  return !OPTIONAL_AUDIO_STATUSES.includes(status.toLowerCase());
};

/**
 * Status color mapping for visual feedback
 */
export const STATUS_COLORS: Record<string, string> = {
  Interested: "success",
  "Sale Made": "success",
  "Appointment Set": "success",

  "Call Back": "info",
  "Callback Requested": "info",
  "My Call Back": "info",
  "Voicemail Left": "info",
  "Follow Up": "info",

  "Not Interested": "muted",
  "Hard Reject": "destructive",
  "Do Not Call": "destructive",
  Abusive: "destructive",
  "Vulnerable Customer": "destructive",

  "No Answer": "warning",
  "Busy Tone": "warning",
  "Customer Busy": "warning",

  "Disconnected Number": "muted",
  "Wrong Number": "muted",
  "Repeated Number": "muted",
  "Blank Call (No Response)": "muted",
  "Robot / Automated": "muted",
  "Answering Machine (Sent to Message)": "muted",

  "Concerned Person Not Available": "muted",
  "Customer Hung Up": "muted",
  Receptionist: "muted",
  "Already have a Website": "muted",
  "Not Eligible": "muted",
  Incomplete: "muted",
  "In Future": "muted",
};
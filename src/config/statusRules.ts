/**
 * Status options for call outcomes
 * These are the possible statuses a caller can assign to a lead
 */
export const CALL_STATUSES = [
  "abusive",
  "already have a website",
  "answering machine (sent to message)",
  "appointment set",
  "blank call (no response)",
  "busy tone",
  "call back",
  "callback requested",
  "concerned person not available",
  "customer busy",
  "customer hung up",
  "disconnected number",
  "do not call",
  "follow up",
  "hard reject",
  "in future",
  "incomplete",
  "interested",
  "my call back",
  "no answer",
  "not eligible",
  "not interested",
  "receptionist",
  "repeated number",
  "robot / automated",
  "sale made",
  "voicemail left",
  "vulnerable customer",
  "wrong number",
] as const;

export type CallStatus = (typeof CALL_STATUSES)[number];

/**
 * Statuses that do NOT require audio upload
 * For these statuses, the audio file is optional
 */
export const OPTIONAL_AUDIO_STATUSES: string[] = [
  "blank call (no response)",
  "busy tone",
  "disconnected number",
  "no answer",
  "wrong number",
  "repeated number",
  "robot / automated",
  "answering machine (sent to message)",
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
  interested: "success",
  "sale made": "success",
  "appointment set": "success",

  "call back": "info",
  "callback requested": "info",
  "my call back": "info",
  "voicemail left": "info",
  "follow up": "info",

  "not interested": "muted",
  "hard reject": "destructive",
  "do not call": "destructive",
  abusive: "destructive",
  "vulnerable customer": "destructive",

  "no answer": "warning",
  "busy tone": "warning",
  "customer busy": "warning",

  "disconnected number": "muted",
  "wrong number": "muted",
  "repeated number": "muted",
  "blank call (no response)": "muted",
  "robot / automated": "muted",
  "answering machine (sent to message)": "muted",

  "concerned person not available": "muted",
  "customer hung up": "muted",
  receptionist: "muted",
  "already have a website": "muted",
  "not eligible": "muted",
  incomplete: "muted",
  "in future": "muted",
};

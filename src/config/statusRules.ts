/**
 * Status options for call outcomes
 * These are the possible statuses a caller can assign to a lead
 */
export const CALL_STATUSES = [
  "interested",
  "not interested",
  "callback requested",
  "voicemail left",
  "no answer",
  "busy tone",
  "disconnected number",
  "wrong number",
  "repeat number",
  "blank call",
  "do not call",
  "sale made",
  "appointment set",
] as const;

export type CallStatus = (typeof CALL_STATUSES)[number];

/**
 * Statuses that do NOT require audio upload
 * For these statuses, the audio file is optional
 */
export const OPTIONAL_AUDIO_STATUSES: string[] = [
  "repeat number",
  "blank call",
  "busy tone",
  "disconnected number",
  "no answer",
  "wrong number",
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
  "callback requested": "info",
  "voicemail left": "info",
  "not interested": "muted",
  "do not call": "destructive",
  "no answer": "warning",
  "busy tone": "warning",
  "disconnected number": "muted",
  "wrong number": "muted",
  "repeat number": "muted",
  "blank call": "muted",
};

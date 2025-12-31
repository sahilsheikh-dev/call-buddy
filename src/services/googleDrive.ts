import { GOOGLE_CONFIG, getAccessToken } from "@/config/google";
import { TIMEOUTS } from "@/config/app";

const DRIVE_API_BASE = "https://www.googleapis.com/upload/drive/v3/files";

/**
 * Generate filename for audio recording
 * Format: <mobile_number>-<YYYYMMDD-HHmmss>.mp3
 */
export const generateAudioFilename = (mobileNumber: string): string => {
  const now = new Date();
  const dateStr = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "-")
    .slice(0, 15);

  // Clean mobile number (remove special chars)
  const cleanNumber = mobileNumber.replace(/[^0-9+]/g, "");

  return `${cleanNumber}-${dateStr}.mp3`;
};

/**
 * Upload audio file to Google Drive
 * Returns the shareable URL of the uploaded file
 */
export const uploadToDrive = async (
  file: File,
  mobileNumber: string
): Promise<string> => {
  const base64 = await fileToBase64(file);

  const res = await fetch(
    `https://script.google.com/macros/s/${
      import.meta.env.VITE_SHEET_WEBHOOK_DEPLOYMENT_ID
    }/exec`,
    {
      method: "POST",
      headers: {
        // IMPORTANT: text/plain prevents CORS preflight
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "uploadAudio",
        mobileNumber,
        mimeType: file.type,
        data: base64,
      }),
    }
  );

  const text = await res.text();
  const json = JSON.parse(text);

  if (!json.success) {
    throw new Error(json.error || "Upload failed");
  }

  return json.url;
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

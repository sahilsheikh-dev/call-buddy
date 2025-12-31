import { GOOGLE_CONFIG, getAccessToken } from '@/config/google';
import { TIMEOUTS } from '@/config/app';

const DRIVE_API_BASE = 'https://www.googleapis.com/upload/drive/v3/files';

/**
 * Generate filename for audio recording
 * Format: <mobile_number>-<YYYYMMDD-HHmmss>.mp3
 */
export const generateAudioFilename = (mobileNumber: string): string => {
  const now = new Date();
  const dateStr = now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .slice(0, 15);
  
  // Clean mobile number (remove special chars)
  const cleanNumber = mobileNumber.replace(/[^0-9+]/g, '');
  
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
  const accessToken = getAccessToken();
  const { driveFolderId } = GOOGLE_CONFIG;

  if (!accessToken) {
    throw new Error('Google Drive access token not configured. Please set up OAuth2 authentication.');
  }

  if (!driveFolderId || driveFolderId === 'YOUR_DRIVE_FOLDER_ID_HERE') {
    throw new Error('Google Drive folder ID not configured. Please update src/config/google.ts');
  }

  const filename = generateAudioFilename(mobileNumber);
  
  // Create metadata for the file
  const metadata = {
    name: filename,
    parents: [driveFolderId],
  };

  // Create multipart form data
  const formData = new FormData();
  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  formData.append('file', file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.DRIVE_UPLOAD);

  try {
    // Upload the file
    const uploadResponse = await fetch(
      `${DRIVE_API_BASE}?uploadType=multipart&fields=id,webViewLink`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Upload failed: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    const fileId = uploadData.id;

    // Make the file publicly accessible
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      }
    );

    // Return the shareable link
    return uploadData.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Upload timed out. Please try again with a smaller file or better connection.');
    }
    throw error;
  }
};

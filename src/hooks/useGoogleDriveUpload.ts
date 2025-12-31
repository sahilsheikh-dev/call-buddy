import { useState, useCallback } from 'react';
import { uploadToDrive } from '@/services/googleDrive';

interface UseGoogleDriveUploadReturn {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  uploadFile: (file: File, mobileNumber: string) => Promise<string>;
  clearError: () => void;
}

export const useGoogleDriveUpload = (): UseGoogleDriveUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, mobileNumber: string): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate progress (since fetch doesn't provide upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const url = await uploadToDrive(file, mobileNumber);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload file';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUploading,
    uploadProgress,
    error,
    uploadFile,
    clearError,
  };
};

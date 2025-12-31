import React, { useRef, useState } from "react";
import { Mic, X, AlertCircle, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  isRequired: boolean;
  error?: string;
  className?: string;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({
  file,
  onChange,
  isRequired,
  error,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("audio/")) {
        return;
      }
      onChange(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      onChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-foreground">
        Call Recording{" "}
        {isRequired && <span className="text-destructive">*</span>}
        {!isRequired && (
          <span className="text-muted-foreground"> (Optional)</span>
        )}
      </label>

      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200",
            isDragging
              ? "border-primary bg-primary/5"
              : error
              ? "border-destructive bg-destructive/5"
              : "border-input hover:border-primary/50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "rounded-full p-3",
                isDragging ? "bg-primary/10" : "bg-secondary"
              )}
            >
              <Mic
                className={cn(
                  "h-6 w-6",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Upload audio file
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tap to select or drag & drop
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-lg animate-fade-in">
          <div className="rounded-full bg-success/20 p-2">
            <FileAudio className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive animate-fade-in">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

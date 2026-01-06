import React, { useState, useCallback, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusSelect } from "./StatusSelect";
import { AudioUpload } from "./AudioUpload";
import { isAudioRequired } from "@/config/statusRules";
import { CallFormData } from "@/types";
import { cn } from "@/lib/utils";
import { formatSecondsToHMS } from "@/utils/time";

interface CallFormProps {
  onSubmit: (data: CallFormData) => Promise<void>;
  isSubmitting: boolean;
  className?: string;
}

interface FormErrors {
  status?: string;
  comment?: string;
  audioFile?: string;
}

export const CallForm: React.FC<CallFormProps> = ({
  onSubmit,
  isSubmitting,
  className,
}) => {
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const audioRequired = status ? isAudioRequired(status) : true;

  // Validate form
  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (!status) {
      newErrors.status = "Please select a call status";
    }

    if (!comment.trim()) {
      newErrors.comment = "Please enter a comment";
    } else if (comment.trim().length < 3) {
      newErrors.comment = "Comment must be at least 3 characters";
    }

    if (audioRequired && !audioFile) {
      newErrors.audioFile = "Audio recording is required for this status";
    }

    return newErrors;
  }, [status, comment, audioFile, audioRequired]);

  // Update errors when form values change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      setErrors(validate());
    }
  }, [status, comment, audioFile, validate, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ status: true, comment: true, audioFile: true });

    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const getAudioDuration = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const audio = document.createElement("audio");
        audio.preload = "metadata";
        audio.src = URL.createObjectURL(file);

        audio.onloadedmetadata = () => {
          URL.revokeObjectURL(audio.src);
          resolve(formatSecondsToHMS(audio.duration));
        };

        audio.onerror = () => reject("Failed to read audio duration");
      });

    let recordingLength = "00:00:00";

    if (audioFile) {
      recordingLength = await getAudioDuration(audioFile);
    }

    await onSubmit({
      status,
      comment,
      audioFile,
      recordingLength,
    });

    // Reset form after successful submission
    setStatus("");
    setComment("");
    setAudioFile(null);
    setErrors({});
    setTouched({});
  };

  const isValid = !errors.status && !errors.comment && !errors.audioFile;
  const canSubmit =
    status && comment.trim() && (audioRequired ? audioFile : true);

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      <StatusSelect
        value={status}
        onChange={(value) => {
          setStatus(value);
          setTouched((prev) => ({ ...prev, status: true }));
        }}
        error={touched.status ? errors.status : undefined}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Comment <span className="text-destructive">*</span>
        </label>
        <Textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setTouched((prev) => ({ ...prev, comment: true }));
          }}
          placeholder="Enter call notes and observations..."
          className={cn(
            "min-h-[100px] resize-none text-base",
            touched.comment &&
              errors.comment &&
              "border-destructive focus-visible:ring-destructive"
          )}
        />
        {touched.comment && errors.comment && (
          <p className="text-sm text-destructive animate-fade-in">
            {errors.comment}
          </p>
        )}
      </div>

      <AudioUpload
        file={audioFile}
        onChange={(file) => {
          setAudioFile(file);
          setTouched((prev) => ({ ...prev, audioFile: true }));
        }}
        isRequired={audioRequired}
        error={touched.audioFile ? errors.audioFile : undefined}
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || !canSubmit}
        className="w-full h-14 text-lg font-semibold min-touch-target"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save and Next
          </span>
        )}
      </Button>
    </form>
  );
};

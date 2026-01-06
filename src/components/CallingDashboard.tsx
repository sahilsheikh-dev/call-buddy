import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import { LeadCard } from "./LeadCard";
import { CallForm } from "./CallForm";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { NoLeadsAvailable } from "./NoLeadsAvailable";
import { useAuth } from "@/contexts/AuthContext";
import { useLeads } from "@/hooks/useLeads";
import { useGoogleDriveUpload } from "@/hooks/useGoogleDriveUpload";
import { CallFormData } from "@/types";
import { toast } from "@/hooks/use-toast";

export const CallingDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    currentLead,
    isLoading,
    error,
    remainingLeads,
    loadLeads,
    saveLead,
    clearError,
  } = useLeads();
  const { uploadFile, isUploading } = useGoogleDriveUpload();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleSubmit = async (data: CallFormData) => {
    if (!currentLead || !user) return;

    setIsSaving(true);

    try {
      let recordingUrl: string | null = null;

      // Upload audio if provided
      if (data.audioFile) {
        try {
          recordingUrl = await uploadFile(data.audioFile, currentLead.phone);
        } catch (uploadError) {
          toast({
            title: "Upload Failed",
            description:
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to upload audio",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
      }

      // Save lead data
      await saveLead(
        data.status ?? "NA",
        data.comment ?? "NA",
        user.username ?? "NA",
        recordingUrl ?? null,
        data.recordingLength ?? "NA"
      );

      toast({
        title: "Lead Saved",
        description: "Moving to next lead...",
      });
    } catch (saveError) {
      toast({
        title: "Save Failed",
        description:
          saveError instanceof Error
            ? saveError.message
            : "Failed to save lead",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isProcessing = isLoading || isSaving || isUploading;

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <Header remainingLeads={remainingLeads} />

      <main className="mx-auto px-4 py-6 space-y-6">
        {/* Loading State */}
        {isLoading && !currentLead && (
          <div className="py-12">
            <LoadingSpinner size="lg" text="Loading leads..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={loadLeads}
            onDismiss={clearError}
          />
        )}

        {/* No Leads State */}
        {!isLoading && !error && !currentLead && (
          <NoLeadsAvailable onRefresh={loadLeads} isLoading={isLoading} />
        )}

        {/* Current Lead */}
        {currentLead && (
          <>
            <LeadCard lead={currentLead} />

            <div className="bg-card rounded-xl card-shadow p-5">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Call Outcome
              </h2>
              <CallForm onSubmit={handleSubmit} isSubmitting={isProcessing} />
            </div>
          </>
        )}

        {/* Processing Overlay */}
        {isProcessing && currentLead && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card rounded-xl card-shadow-lg p-8 text-center max-w-xs mx-4">
              <LoadingSpinner
                size="lg"
                text={
                  isUploading
                    ? "Uploading recording..."
                    : isSaving
                    ? "Saving lead..."
                    : "Processing..."
                }
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

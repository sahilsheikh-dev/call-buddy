import { useState, useCallback } from 'react';
import { Lead } from '@/types';
import { fetchSheetData, getNextAvailableLead, updateSheetRow } from '@/services/googleSheets';

interface UseLeadsReturn {
  currentLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  totalLeads: number;
  remainingLeads: number;
  loadLeads: () => Promise<void>;
  saveLead: (
    status: string,
    comment: string,
    callerUsername: string,
    recordingUrl: string
  ) => Promise<void>;
  clearError: () => void;
}

export const useLeads = (): UseLeadsReturn => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allLeads = await fetchSheetData();
      setLeads(allLeads);
      
      const nextLead = getNextAvailableLead(allLeads);
      setCurrentLead(nextLead);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load leads';
      setError(message);
      setCurrentLead(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveLead = useCallback(async (
    status: string,
    comment: string,
    callerUsername: string,
    recordingUrl: string
  ) => {
    if (!currentLead) {
      throw new Error('No lead selected');
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateSheetRow(
        currentLead.rowIndex,
        status,
        comment,
        callerUsername,
        recordingUrl
      );

      // Update local state
      const updatedLeads = leads.map((lead) =>
        lead.rowIndex === currentLead.rowIndex
          ? { ...lead, status, comment, caller_username: callerUsername, call_recording_url: recordingUrl }
          : lead
      );
      
      setLeads(updatedLeads);
      
      // Get next available lead
      const nextLead = getNextAvailableLead(updatedLeads);
      setCurrentLead(nextLead);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save lead';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentLead, leads]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const remainingLeads = leads.filter((lead) => !lead.status || lead.status.trim() === '').length;

  return {
    currentLead,
    isLoading,
    error,
    totalLeads: leads.length,
    remainingLeads,
    loadLeads,
    saveLead,
    clearError,
  };
};

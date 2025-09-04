import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Journal = Database['public']['Tables']['journals']['Row'];

export const useJournals = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchJournals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching journals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createJournal = async (journalData: Omit<Journal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journals')
        .insert([{
          ...journalData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setJournals(prev => [data, ...prev]);
      toast({
        title: "Journal entry created",
        description: "Your journal entry has been saved successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating journal entry",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateJournal = async (id: string, updates: Partial<Journal>) => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setJournals(prev => prev.map(journal => journal.id === id ? data : journal));
      toast({
        title: "Journal updated",
        description: "Your journal entry has been updated successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating journal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteJournal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setJournals(prev => prev.filter(journal => journal.id !== id));
      toast({
        title: "Journal deleted",
        description: "Your journal entry has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting journal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [user]);

  return {
    journals,
    loading,
    createJournal,
    updateJournal,
    deleteJournal,
    refetch: fetchJournals
  };
};
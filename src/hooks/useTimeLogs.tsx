import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type TimeLog = Database['public']['Tables']['time_logs']['Row'];

export const useTimeLogs = () => {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTimeLogs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('time_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimeLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching time logs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTimeLog = async (logData: Omit<TimeLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('time_logs')
        .insert([{
          ...logData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setTimeLogs(prev => [data, ...prev]);
      toast({
        title: "Time log created",
        description: "Your time log has been added successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating time log",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTimeLog = async (id: string, updates: Partial<TimeLog>) => {
    try {
      const { data, error } = await supabase
        .from('time_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTimeLogs(prev => prev.map(log => log.id === id ? data : log));
      toast({
        title: "Time log updated",
        description: "Your time log has been updated successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating time log",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTimeLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTimeLogs(prev => prev.filter(log => log.id !== id));
      toast({
        title: "Time log deleted",
        description: "Your time log has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting time log",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTimeLogs();
  }, [user]);

  return {
    timeLogs,
    loading,
    createTimeLog,
    updateTimeLog,
    deleteTimeLog,
    refetch: fetchTimeLogs
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Goal = Database['public']['Tables']['goals']['Row'];

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching goals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([{
          ...goalData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => [data, ...prev]);
      toast({
        title: "Goal created",
        description: "Your goal has been added successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => prev.map(goal => goal.id === id ? data : goal));
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast({
        title: "Goal deleted",
        description: "Your goal has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleComplete = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newStatus = goal.status === 'completed' ? 'pending' : 'completed';
    const updates: Partial<Goal> = {
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined
    };

    await updateGoal(id, updates);
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    toggleComplete,
    refetch: fetchGoals
  };
};
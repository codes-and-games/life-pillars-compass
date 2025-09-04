import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Vision = Database['public']['Tables']['visions']['Row'];

export const useVisions = () => {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVisions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('visions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisions(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching visions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVision = async (visionData: Partial<Vision> & { title: string; description: string; pillar: Vision['pillar'] }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('visions')
        .insert([{
          ...visionData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setVisions(prev => [data, ...prev]);
      toast({
        title: "Vision created",
        description: "Your vision has been added successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating vision",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateVision = async (id: string, updates: Partial<Vision>) => {
    try {
      const { data, error } = await supabase
        .from('visions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setVisions(prev => prev.map(vision => vision.id === id ? data : vision));
      toast({
        title: "Vision updated",
        description: "Your vision has been updated successfully.",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating vision",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteVision = async (id: string) => {
    try {
      const { error } = await supabase
        .from('visions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVisions(prev => prev.filter(vision => vision.id !== id));
      toast({
        title: "Vision deleted",
        description: "Your vision has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting vision",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAchieved = async (id: string) => {
    const vision = visions.find(v => v.id === id);
    if (!vision) return;

    const updates: Partial<Vision> = {
      is_achieved: !vision.is_achieved,
      achieved_at: !vision.is_achieved ? new Date().toISOString() : undefined
    };

    await updateVision(id, updates);
  };

  useEffect(() => {
    fetchVisions();
  }, [user]);

  return {
    visions,
    loading,
    createVision,
    updateVision,
    deleteVision,
    toggleAchieved,
    refetch: fetchVisions
  };
};
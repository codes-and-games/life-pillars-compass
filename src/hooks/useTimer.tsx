import { useState, useEffect, useRef } from 'react';
import { useTimeLogs } from './useTimeLogs';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

type PillarType = Database['public']['Enums']['pillar_type'];

export interface ActiveTimer {
  id: string;
  activity: string;
  pillar: PillarType;
  startTime: Date;
  elapsedSeconds: number;
  isRunning: boolean;
}

export const useTimer = () => {
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { createTimeLog } = useTimeLogs();
  const { toast } = useToast();

  // Load timer from localStorage on mount
  useEffect(() => {
    const savedTimer = localStorage.getItem('activeTimer');
    if (savedTimer) {
      const timer: ActiveTimer = JSON.parse(savedTimer);
      timer.startTime = new Date(timer.startTime);
      
      // Calculate elapsed time since last save
      const now = new Date();
      const additionalSeconds = Math.floor((now.getTime() - timer.startTime.getTime()) / 1000);
      timer.elapsedSeconds = additionalSeconds;
      
      setActiveTimer(timer);
      
      // Resume if it was running
      if (timer.isRunning) {
        startTicking();
      }
    }
  }, []);

  // Save timer to localStorage whenever it changes
  useEffect(() => {
    if (activeTimer) {
      localStorage.setItem('activeTimer', JSON.stringify(activeTimer));
    } else {
      localStorage.removeItem('activeTimer');
    }
  }, [activeTimer]);

  const startTicking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setActiveTimer(prev => {
        if (!prev || !prev.isRunning) return prev;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1
        };
      });
    }, 1000);
  };

  const stopTicking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = (activity: string, pillar: PillarType) => {
    const newTimer: ActiveTimer = {
      id: Date.now().toString(),
      activity,
      pillar,
      startTime: new Date(),
      elapsedSeconds: 0,
      isRunning: true
    };
    
    setActiveTimer(newTimer);
    startTicking();
    
    toast({
      title: "Timer started",
      description: `Tracking time for: ${activity}`,
    });
  };

  const pauseTimer = () => {
    if (!activeTimer) return;
    
    setActiveTimer(prev => prev ? { ...prev, isRunning: false } : null);
    stopTicking();
    
    toast({
      title: "Timer paused",
      description: "You can resume or stop the timer anytime",
    });
  };

  const resumeTimer = () => {
    if (!activeTimer) return;
    
    setActiveTimer(prev => prev ? { ...prev, isRunning: true } : null);
    startTicking();
    
    toast({
      title: "Timer resumed",
      description: "Continuing to track your time",
    });
  };

  const stopTimer = async () => {
    if (!activeTimer) return;
    
    stopTicking();
    
    // Create time log entry
    const durationMinutes = Math.floor(activeTimer.elapsedSeconds / 60);
    
    if (durationMinutes > 0) {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - (activeTimer.elapsedSeconds * 1000));
      
      await createTimeLog({
        activity: activeTimer.activity,
        pillar: activeTimer.pillar,
        duration_minutes: durationMinutes,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        notes: `Timer session for ${activeTimer.activity}`,
      });
      
      toast({
        title: "Timer stopped",
        description: `Logged ${durationMinutes} minutes for ${activeTimer.activity}`,
      });
    } else {
      toast({
        title: "Timer stopped",
        description: "Timer was too short to log",
        variant: "destructive",
      });
    }
    
    setActiveTimer(null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    activeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    formatTime
  };
};
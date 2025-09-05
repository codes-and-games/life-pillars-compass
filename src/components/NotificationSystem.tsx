import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGoals } from "@/hooks/useGoals";
import { useAuth } from "@/hooks/useAuth";

export const NotificationSystem = () => {
  const { toast } = useToast();
  const { goals } = useGoals();
  const { profile } = useAuth();

  useEffect(() => {
    // Daily streak notification
    if (profile?.current_streak && profile.current_streak > 0) {
      const lastNotification = localStorage.getItem('last_streak_notification');
      const today = new Date().toDateString();
      
      if (lastNotification !== today) {
        setTimeout(() => {
          toast({
            title: `🔥 ${profile.current_streak} Day Streak!`,
            description: "Keep up the great work with your daily goals!",
          });
          localStorage.setItem('last_streak_notification', today);
        }, 2000);
      }
    }

    // Daily goals reminder
    const checkDailyGoals = () => {
      const todayGoals = goals.filter(goal => 
        goal.frequency === 'daily' && 
        goal.status === 'pending' &&
        (!goal.due_date || new Date(goal.due_date).toDateString() === new Date().toDateString())
      );

      if (todayGoals.length > 0) {
        const lastReminder = localStorage.getItem('last_goals_reminder');
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(20, 0, 0, 0); // 8 PM reminder

        if (now > reminderTime && lastReminder !== now.toDateString()) {
          toast({
            title: "Daily Goals Reminder",
            description: `You have ${todayGoals.length} pending goals for today.`,
            variant: "default",
          });
          localStorage.setItem('last_goals_reminder', now.toDateString());
        }
      }
    };

    // Check every hour
    const interval = setInterval(checkDailyGoals, 3600000);
    // Check immediately
    setTimeout(checkDailyGoals, 5000);

    return () => clearInterval(interval);
  }, [goals, profile, toast]);

  useEffect(() => {
    // Congratulations on goal completion
    const completedGoals = goals.filter(goal => 
      goal.status === 'completed' && 
      goal.completed_at &&
      new Date(goal.completed_at).toDateString() === new Date().toDateString()
    );

    if (completedGoals.length > 0) {
      const lastCongrats = localStorage.getItem('last_congrats');
      const today = new Date().toDateString();
      
      if (lastCongrats !== today) {
        setTimeout(() => {
          toast({
            title: "🎉 Great Job!",
            description: `You've completed ${completedGoals.length} goals today!`,
          });
          localStorage.setItem('last_congrats', today);
        }, 1000);
      }
    }
  }, [goals, toast]);

  // This component doesn't render anything
  return null;
};
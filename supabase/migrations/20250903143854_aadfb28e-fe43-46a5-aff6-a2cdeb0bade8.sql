-- Fix security warnings by setting search_path for functions

-- Update the updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the new user registration function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the streak update function
CREATE OR REPLACE FUNCTION public.update_user_streak(user_id UUID)
RETURNS VOID AS $$
DECLARE
  today DATE := CURRENT_DATE;
  yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  daily_goals_count INTEGER;
  completed_daily_goals_count INTEGER;
  current_streak INTEGER;
  last_completion_date DATE;
BEGIN
  -- Get current streak and last completion date
  SELECT profiles.current_streak, profiles.last_goal_completion_date
  INTO current_streak, last_completion_date
  FROM public.profiles
  WHERE profiles.id = user_id;

  -- Count today's daily goals
  SELECT COUNT(*) INTO daily_goals_count
  FROM public.goals
  WHERE goals.user_id = update_user_streak.user_id
    AND goals.frequency = 'daily'
    AND goals.due_date = today;

  -- Count completed daily goals for today
  SELECT COUNT(*) INTO completed_daily_goals_count
  FROM public.goals
  WHERE goals.user_id = update_user_streak.user_id
    AND goals.frequency = 'daily'
    AND goals.due_date = today
    AND goals.status = 'completed';

  -- Update streak logic
  IF daily_goals_count > 0 AND daily_goals_count = completed_daily_goals_count THEN
    -- All daily goals completed
    IF last_completion_date = yesterday THEN
      -- Consecutive day, increment streak
      UPDATE public.profiles
      SET current_streak = current_streak + 1,
          longest_streak = GREATEST(longest_streak, current_streak + 1),
          last_goal_completion_date = today
      WHERE id = user_id;
    ELSIF last_completion_date != today THEN
      -- First completion or gap, reset to 1
      UPDATE public.profiles
      SET current_streak = 1,
          longest_streak = GREATEST(longest_streak, 1),
          last_goal_completion_date = today
      WHERE id = user_id;
    END IF;
  ELSIF last_completion_date < yesterday AND daily_goals_count > 0 THEN
    -- Missed a day, reset streak
    UPDATE public.profiles
    SET current_streak = 0
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
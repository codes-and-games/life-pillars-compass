-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE goal_frequency AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE goal_status AS ENUM ('pending', 'completed', 'overdue');
CREATE TYPE mood_type AS ENUM ('excellent', 'good', 'neutral', 'bad', 'terrible');
CREATE TYPE pillar_type AS ENUM ('Health', 'Academics', 'Passions', 'Relationship', 'Career');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'User',
  age INTEGER,
  avatar_url TEXT,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_goal_completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pillar pillar_type NOT NULL,
  frequency goal_frequency NOT NULL,
  status goal_status NOT NULL DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time_logs table
CREATE TABLE public.time_logs (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  pillar pillar_type NOT NULL,
  duration_minutes INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journals table
CREATE TABLE public.journals (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pillar pillar_type NOT NULL,
  mood mood_type NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visions table
CREATE TABLE public.visions (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  pillar pillar_type NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  target_date DATE,
  is_achieved BOOLEAN NOT NULL DEFAULT false,
  achieved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for goals
CREATE POLICY "Users can view their own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for time_logs
CREATE POLICY "Users can view their own time logs" ON public.time_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own time logs" ON public.time_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own time logs" ON public.time_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own time logs" ON public.time_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for journals
CREATE POLICY "Users can view their own journals" ON public.journals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own journals" ON public.journals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journals" ON public.journals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journals" ON public.journals
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for visions
CREATE POLICY "Users can view their own visions" ON public.visions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own visions" ON public.visions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own visions" ON public.visions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own visions" ON public.visions
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_logs_updated_at
  BEFORE UPDATE ON public.time_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journals_updated_at
  BEFORE UPDATE ON public.journals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visions_updated_at
  BEFORE UPDATE ON public.visions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update streak
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_due_date ON public.goals(due_date);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_time_logs_user_id ON public.time_logs(user_id);
CREATE INDEX idx_time_logs_created_at ON public.time_logs(created_at);
CREATE INDEX idx_journals_user_id ON public.journals(user_id);
CREATE INDEX idx_journals_entry_date ON public.journals(entry_date);
CREATE INDEX idx_visions_user_id ON public.visions(user_id);
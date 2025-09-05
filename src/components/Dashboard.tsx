import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Eye, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Calendar,
  Flame,
  Plus,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useJournals } from "@/hooks/useJournals";
import { useVisions } from "@/hooks/useVisions";
import { useTimeLogs } from "@/hooks/useTimeLogs";
import { useAuth } from "@/hooks/useAuth";
import { GoalForm } from "@/components/forms/GoalForm";
import { JournalForm } from "@/components/forms/JournalForm";

export const Dashboard = () => {
  const { goals, loading: goalsLoading } = useGoals();
  const { journals, loading: journalsLoading } = useJournals();
  const { visions, loading: visionsLoading } = useVisions();
  const { timeLogs, loading: timeLogsLoading } = useTimeLogs();
  const { profile } = useAuth();

  const loading = goalsLoading || journalsLoading || visionsLoading || timeLogsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Calculate real statistics
  const todayGoals = goals.filter(goal => 
    goal.frequency === 'daily' && 
    (!goal.due_date || new Date(goal.due_date).toDateString() === new Date().toDateString())
  );
  const completedTodayGoals = todayGoals.filter(goal => goal.status === 'completed');
  
  const activeVisions = visions.filter(vision => !vision.is_achieved);
  
  const thisMonthJournals = journals.filter(journal => 
    new Date(journal.created_at).getMonth() === new Date().getMonth()
  );
  
  const thisWeekTimeLogs = timeLogs.filter(log => {
    const logDate = new Date(log.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  });
  
  const totalHoursThisWeek = thisWeekTimeLogs.reduce((total, log) => total + log.duration_minutes, 0) / 60;

  // Calculate pillar progress based on completed goals
  const pillarProgress = [
    'Health', 'Academics', 'Passions', 'Relationship', 'Career'
  ].map(pillar => {
    const pillarGoals = goals.filter(goal => goal.pillar === pillar);
    const completedPillarGoals = pillarGoals.filter(goal => goal.status === 'completed');
    const progress = pillarGoals.length > 0 ? (completedPillarGoals.length / pillarGoals.length) * 100 : 0;
    return { name: pillar, color: pillar.toLowerCase(), progress: Math.round(progress) };
  });

  const stats = [
    { 
      name: 'Daily Goals', 
      value: `${completedTodayGoals.length}/${todayGoals.length}`, 
      icon: Target, 
      change: `${completedTodayGoals.length} completed today` 
    },
    { 
      name: 'Active Visions', 
      value: activeVisions.length.toString(), 
      icon: Eye, 
      change: `${visions.length - activeVisions.length} achieved` 
    },
    { 
      name: 'Journal Entries', 
      value: thisMonthJournals.length.toString(), 
      icon: BookOpen, 
      change: 'This month' 
    },
    { 
      name: 'Hours Logged', 
      value: totalHoursThisWeek.toFixed(1), 
      icon: Clock, 
      change: 'This week' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress across all life pillars
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Card className="p-4 bg-gradient-success text-white">
            <div className="flex items-center space-x-3">
              <Flame className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">Current Streak</p>
                <p className="text-2xl font-bold">{profile?.current_streak || 0} days</p>
              </div>
            </div>
          </Card>
          
          <GoalForm 
            trigger={
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-success mt-1">{stat.change}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pillars Progress */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Life Pillars Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {pillarProgress.map((pillar) => (
            <div key={pillar.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{pillar.name}</span>
                <span className="text-sm text-muted-foreground">{pillar.progress}%</span>
              </div>
              <Progress 
                value={pillar.progress} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Today's Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Today's Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayGoals.length > 0 ? (
              <div className="space-y-3">
                {todayGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                    {goal.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-muted" />
                    )}
                    <span className={`text-sm ${goal.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {goal.title}
                    </span>
                  </div>
                ))}
                {todayGoals.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{todayGoals.length - 3} more goals
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No goals set for today</p>
                <GoalForm 
                  trigger={
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Goal
                    </Button>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Recent Journals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {journals.length > 0 ? (
              <div className="space-y-3">
                {journals.slice(0, 3).map((journal) => (
                  <div key={journal.id} className="p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground">{journal.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(journal.entry_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {journal.content}
                    </p>
                  </div>
                ))}
                {journals.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{journals.length - 3} more entries
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent journal entries</p>
                <JournalForm 
                  trigger={
                    <Button variant="outline" size="sm" className="mt-2">
                      Write Entry
                    </Button>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
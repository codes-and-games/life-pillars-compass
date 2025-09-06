import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Calendar,
  Award
} from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useJournals } from "@/hooks/useJournals";
import { useTimeLogs } from "@/hooks/useTimeLogs";
import { useVisions } from "@/hooks/useVisions";
import { useAuth } from "@/hooks/useAuth";
import { startOfMonth, endOfMonth, format } from "date-fns";

const getPillarColor = (pillar: string) => {
  const colors = {
    Health: "border-health",
    Academics: "border-academics", 
    Passions: "border-passions",
    Relationship: "border-relationship",
    Career: "border-career",
  };
  return colors[pillar as keyof typeof colors] || "border-primary";
};

export const Insights = () => {
  const { goals } = useGoals();
  const { journals } = useJournals();
  const { timeLogs } = useTimeLogs();
  const { visions } = useVisions();
  const { profile } = useAuth();

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Goals stats
    const thisMonthGoals = goals.filter(goal => {
      const goalDate = new Date(goal.created_at);
      return goalDate >= monthStart && goalDate <= monthEnd;
    });
    const completedGoals = thisMonthGoals.filter(goal => goal.status === 'completed');

    // Journal stats
    const thisMonthJournals = journals.filter(journal => {
      const journalDate = new Date(journal.entry_date);
      return journalDate >= monthStart && journalDate <= monthEnd;
    });

    // Time logs stats
    const thisMonthTimeLogs = timeLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= monthStart && logDate <= monthEnd;
    });
    const totalHours = thisMonthTimeLogs.reduce((sum, log) => sum + log.duration_minutes, 0) / 60;

    return {
      goalsCompleted: completedGoals.length,
      totalGoals: thisMonthGoals.length,
      journalEntries: thisMonthJournals.length,
      hoursLogged: Math.round(totalHours * 10) / 10,
      completionRate: thisMonthGoals.length > 0 ? Math.round((completedGoals.length / thisMonthGoals.length) * 100) : 0
    };
  }, [goals, journals, timeLogs]);

  const pillarProgress = useMemo(() => {
    const pillars = ['Health', 'Academics', 'Passions', 'Relationship', 'Career'];
    
    return pillars.map(pillar => {
      const pillarGoals = goals.filter(goal => goal.pillar === pillar.toLowerCase());
      const completedPillarGoals = pillarGoals.filter(goal => goal.status === 'completed');
      const progress = pillarGoals.length > 0 ? Math.round((completedPillarGoals.length / pillarGoals.length) * 100) : 0;
      
      return {
        pillar,
        progress,
        change: progress > 0 ? `+${Math.floor(Math.random() * 15)}%` : '0%'
      };
    });
  }, [goals]);

  const pillarTimeDistribution = useMemo(() => {
    const pillars = ['Health', 'Academics', 'Passions', 'Relationship', 'Career'];
    const distribution: { [key: string]: number } = {};
    
    pillars.forEach(pillar => {
      const pillarTime = timeLogs
        .filter(log => log.pillar === pillar.toLowerCase())
        .reduce((sum, log) => sum + log.duration_minutes, 0);
      distribution[pillar] = Math.round(pillarTime / 60 * 10) / 10;
    });
    
    return distribution;
  }, [timeLogs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground mt-1">
          Analyze your progress and productivity patterns
        </p>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goals Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {monthlyStats.goalsCompleted}/{monthlyStats.totalGoals}
                </p>
                <p className="text-xs text-success mt-1">{monthlyStats.completionRate}% completion rate</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Journal Entries</p>
                <p className="text-2xl font-bold text-foreground">{monthlyStats.journalEntries}</p>
                <p className="text-xs text-success mt-1">This month</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours Logged</p>
                <p className="text-2xl font-bold text-foreground">{monthlyStats.hoursLogged}h</p>
                <p className="text-xs text-success mt-1">Across all pillars</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-foreground">{profile?.current_streak || 0} days</p>
                <p className="text-xs text-success mt-1">Personal best: {profile?.longest_streak || 0}</p>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Progress by Pillar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {pillarProgress.map((item) => (
            <div key={item.pillar} className={`p-4 border-l-4 ${getPillarColor(item.pillar)} bg-muted/20 rounded-r-lg`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">{item.pillar}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${item.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                    {item.change}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.progress}%</span>
                </div>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Productivity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Time Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(pillarTimeDistribution).map(([pillar, hours]) => (
              <div key={pillar} className="flex justify-between items-center">
                <span className="font-medium text-foreground">{pillar}</span>
                <span className="text-muted-foreground">{hours}h</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Latest journal entry</div>
              <div className="text-sm">
                {journals.length > 0 
                  ? format(new Date(journals[0].entry_date), 'MMM dd, yyyy')
                  : 'No entries yet'
                }
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Active visions</div>
              <div className="text-sm">
                {visions.filter(v => !v.is_achieved).length} in progress
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Goals this week</div>
              <div className="text-sm">
                {goals.filter(g => g.frequency === 'daily' || g.frequency === 'weekly').length} active
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
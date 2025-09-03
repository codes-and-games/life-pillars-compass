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

const mockData = {
  weeklyProgress: [
    { pillar: 'Health', progress: 85, change: '+12%' },
    { pillar: 'Academics', progress: 72, change: '+8%' },
    { pillar: 'Passions', progress: 90, change: '+15%' },
    { pillar: 'Relationship', progress: 68, change: '+5%' },
    { pillar: 'Career', progress: 78, change: '+10%' },
  ],
  monthlyStats: {
    goalsCompleted: 42,
    totalGoals: 60,
    journalEntries: 18,
    hoursLogged: 156.5,
  }
};

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
                  {mockData.monthlyStats.goalsCompleted}/{mockData.monthlyStats.totalGoals}
                </p>
                <p className="text-xs text-success mt-1">70% completion rate</p>
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
                <p className="text-2xl font-bold text-foreground">{mockData.monthlyStats.journalEntries}</p>
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
                <p className="text-2xl font-bold text-foreground">{mockData.monthlyStats.hoursLogged}h</p>
                <p className="text-xs text-success mt-1">+22% from last month</p>
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
                <p className="text-2xl font-bold text-foreground">7 days</p>
                <p className="text-xs text-success mt-1">Personal best: 14</p>
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
            <span>Weekly Progress by Pillar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockData.weeklyProgress.map((item) => (
            <div key={item.pillar} className={`p-4 border-l-4 ${getPillarColor(item.pillar)} bg-muted/20 rounded-r-lg`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">{item.pillar}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-success">{item.change}</span>
                  <span className="text-sm text-muted-foreground">{item.progress}%</span>
                </div>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Productivity Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Time Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Monthly Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Calendar view coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
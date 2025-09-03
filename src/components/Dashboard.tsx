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
  Plus
} from "lucide-react";

const pillars = [
  { name: 'Health', color: 'health', progress: 75 },
  { name: 'Academics', color: 'academics', progress: 60 },
  { name: 'Passions', color: 'passions', progress: 85 },
  { name: 'Relationship', color: 'relationship', progress: 70 },
  { name: 'Career', color: 'career', progress: 80 },
];

const stats = [
  { name: 'Daily Goals', value: '3/5', icon: Target, change: '+2 from yesterday' },
  { name: 'Active Visions', value: '8', icon: Eye, change: '+1 this week' },
  { name: 'Journal Entries', value: '15', icon: BookOpen, change: 'This month' },
  { name: 'Hours Logged', value: '42.5', icon: Clock, change: 'This week' },
];

export const Dashboard = () => {
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
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </Card>
          
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
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
          {pillars.map((pillar) => (
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
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No goals set for today</p>
              <Button variant="outline" size="sm" className="mt-2">
                Add Goal
              </Button>
            </div>
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
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent journal entries</p>
              <Button variant="outline" size="sm" className="mt-2">
                Write Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
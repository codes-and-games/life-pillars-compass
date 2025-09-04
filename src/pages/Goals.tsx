import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Plus, Clock, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";

const getPillarColor = (pillar: string) => {
  const colors = {
    Health: "bg-health",
    Academics: "bg-academics", 
    Passions: "bg-passions",
    Relationship: "bg-relationship",
    Career: "bg-career",
  };
  return colors[pillar as keyof typeof colors] || "bg-primary";
};

export const Goals = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const { goals, loading, toggleComplete } = useGoals();

  const goalsByFrequency = {
    daily: goals.filter(goal => goal.frequency === 'daily'),
    weekly: goals.filter(goal => goal.frequency === 'weekly'),
    monthly: goals.filter(goal => goal.frequency === 'monthly'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goals</h1>
          <p className="text-muted-foreground mt-1">
            Manage your daily, weekly, and monthly objectives
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Daily</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Weekly</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Monthly</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(goalsByFrequency).map(([period, periodGoals]) => (
          <TabsContent key={period} value={period} className="space-y-4">
            <div className="grid gap-4">
              {periodGoals.map((goal) => (
                <Card key={goal.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-8 h-8 rounded-full ${
                            goal.status === 'completed'
                              ? "bg-success text-success-foreground" 
                              : "border-2 border-muted"
                          }`}
                          onClick={() => toggleComplete(goal.id)}
                        >
                          {goal.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <div>
                          <h3 className={`font-medium ${
                            goal.status === 'completed' ? "line-through text-muted-foreground" : "text-foreground"
                          }`}>
                            {goal.title}
                          </h3>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className={`${getPillarColor(goal.pillar)} text-white`}>
                        {goal.pillar}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {periodGoals.length === 0 && (
                <Card className="hover-lift">
                  <CardContent className="p-12 text-center">
                    <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No {period} goals yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your first {period} goal to get started
                    </p>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Goal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
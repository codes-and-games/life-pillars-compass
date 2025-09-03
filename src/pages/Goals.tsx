import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Plus, Clock, Calendar, CheckCircle } from "lucide-react";

const mockGoals = {
  daily: [
    { id: 1, title: "Morning workout", pillar: "Health", completed: true },
    { id: 2, title: "Read 30 minutes", pillar: "Academics", completed: false },
    { id: 3, title: "Practice guitar", pillar: "Passions", completed: false },
  ],
  weekly: [
    { id: 4, title: "Complete project proposal", pillar: "Career", completed: false },
    { id: 5, title: "Call family", pillar: "Relationship", completed: true },
  ],
  monthly: [
    { id: 6, title: "Launch side project", pillar: "Career", completed: false },
    { id: 7, title: "Read 3 books", pillar: "Academics", completed: false },
  ],
};

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

        {Object.entries(mockGoals).map(([period, goals]) => (
          <TabsContent key={period} value={period} className="space-y-4">
            <div className="grid gap-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-8 h-8 rounded-full ${
                            goal.completed 
                              ? "bg-success text-success-foreground" 
                              : "border-2 border-muted"
                          }`}
                        >
                          {goal.completed && <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <div>
                          <h3 className={`font-medium ${
                            goal.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}>
                            {goal.title}
                          </h3>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`${getPillarColor(goal.pillar)} text-white`}>
                        {goal.pillar}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {goals.length === 0 && (
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Play, Pause } from "lucide-react";

const mockTimeLogs = [
  { 
    id: 1, 
    activity: "Morning workout", 
    pillar: "Health", 
    duration: "45 min",
    date: "2024-01-15",
    status: "completed"
  },
  { 
    id: 2, 
    activity: "Study session", 
    pillar: "Academics", 
    duration: "2h 30min",
    date: "2024-01-15",
    status: "completed"
  },
  { 
    id: 3, 
    activity: "Guitar practice", 
    pillar: "Passions", 
    duration: "1h 15min",
    date: "2024-01-14",
    status: "completed"
  },
];

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

export const TimeLogs = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Time Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track how you spend your time across different activities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Start Timer
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Active Timer */}
      <Card className="bg-gradient-accent text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Currently Tracking</h3>
              <p className="opacity-90">Deep work session</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">1:23:45</div>
              <div className="flex items-center space-x-2 mt-2">
                <Button variant="secondary" size="sm">
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </Button>
                <Button variant="secondary" size="sm">
                  Stop
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Time Logs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Logs</h2>
        
        <div className="grid gap-4">
          {mockTimeLogs.map((log) => (
            <Card key={log.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Clock className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium text-foreground">{log.activity}</h3>
                      <p className="text-sm text-muted-foreground">{log.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">{log.duration}</div>
                    <Badge variant="secondary" className={`${getPillarColor(log.pillar)} text-white mt-1`}>
                      {log.pillar}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
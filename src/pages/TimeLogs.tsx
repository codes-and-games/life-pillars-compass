import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Play, Pause, Square, Loader2, Pencil, Trash2 } from "lucide-react";
import { useTimeLogs } from "@/hooks/useTimeLogs";
import { useTimer } from "@/hooks/useTimer";
import { TimeLogForm } from "@/components/forms/TimeLogForm";

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
  const { timeLogs, loading, deleteTimeLog } = useTimeLogs();
  const { activeTimer, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime } = useTimer();

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
          <h1 className="text-3xl font-bold text-foreground">Time Logs</h1>
          <p className="text-muted-foreground mt-1">
            Track how you spend your time across different activities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <TimeLogForm 
            onStartTimer={(activity, pillar) => startTimer(activity, pillar)}
            trigger={
              <Button variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            }
          />
          <TimeLogForm />
        </div>
      </div>

      {/* Active Timer */}
      {activeTimer && (
        <Card className="bg-gradient-accent text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Currently Tracking</h3>
                <p className="opacity-90">{activeTimer.activity}</p>
                <Badge variant="secondary" className={`${getPillarColor(activeTimer.pillar)} text-white mt-1`}>
                  {activeTimer.pillar}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{formatTime(activeTimer.elapsedSeconds)}</div>
                <div className="flex items-center space-x-2 mt-2">
                  {activeTimer.isRunning ? (
                    <Button variant="secondary" size="sm" onClick={pauseTimer}>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={resumeTimer}>
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={stopTimer}>
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Time Logs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Logs</h2>
        
        <div className="grid gap-4">
          {timeLogs.map((log) => (
            <Card key={log.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Clock className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium text-foreground">{log.activity}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{log.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">{log.duration_minutes}min</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className={`${getPillarColor(log.pillar)} text-white`}>
                        {log.pillar}
                      </Badge>
                      <TimeLogForm 
                        timeLog={log} 
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Pencil className="w-3 h-3" />
                          </Button>
                        }
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteTimeLog(log.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {timeLogs.length === 0 && !activeTimer && (
            <Card className="hover-lift border-dashed border-2 border-muted">
              <CardContent className="p-12 text-center">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No Time Logs Yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking your time or add a manual entry
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <TimeLogForm 
                    onStartTimer={(activity, pillar) => startTimer(activity, pillar)}
                    trigger={
                      <Button variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Start Timer
                      </Button>
                    }
                  />
                  <TimeLogForm 
                    trigger={
                      <Button variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Manual Entry
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
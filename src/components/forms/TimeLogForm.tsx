import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useTimeLogs, type TimeLog } from "@/hooks/useTimeLogs";
import { Database } from "@/integrations/supabase/types";

type PillarType = Database['public']['Enums']['pillar_type'];

interface TimeLogFormProps {
  timeLog?: TimeLog;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  onStartTimer?: (activity: string, pillar: PillarType) => void;
}

export const TimeLogForm = ({ timeLog, onSuccess, trigger, onStartTimer }: TimeLogFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    activity: timeLog?.activity || "",
    pillar: (timeLog?.pillar || "Health") as PillarType,
    duration_minutes: timeLog?.duration_minutes || 0,
    notes: timeLog?.notes || "",
    start_time: timeLog?.start_time ? new Date(timeLog.start_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    end_time: timeLog?.end_time ? new Date(timeLog.end_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const { createTimeLog, updateTimeLog } = useTimeLogs();

  const calculateDuration = () => {
    if (formData.start_time && formData.end_time) {
      const start = new Date(formData.start_time);
      const end = new Date(formData.end_time);
      const diffMs = end.getTime() - start.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      setFormData(prev => ({ ...prev, duration_minutes: diffMinutes }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If onStartTimer is provided and we have activity and pillar, start timer instead
    if (onStartTimer && formData.activity && formData.pillar && !timeLog) {
      onStartTimer(formData.activity, formData.pillar);
      setOpen(false);
      // Reset form after starting timer
      setFormData({
        activity: "",
        pillar: "Health",
        duration_minutes: 0,
        notes: "",
        start_time: "",
        end_time: "",
      });
      return;
    }
    
    setLoading(true);

    try {
      const logData = {
        ...formData,
        start_time: formData.start_time ? new Date(formData.start_time).toISOString() : undefined,
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : undefined,
      };

      if (timeLog) {
        await updateTimeLog(timeLog.id, logData);
      } else {
        await createTimeLog(logData);
      }
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Manual Entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>
            {timeLog ? 'Edit Time Log' : 
             onStartTimer ? 'Start Timer' : 
             'Create New Time Log'}
          </DialogTitle>
          <p id="dialog-description" className="text-sm text-muted-foreground">
            {timeLog ? 'Modify your existing time log entry' : 
             onStartTimer ? 'Fill in details to start tracking time' : 
             'Add a manual time log entry'}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity">Activity</Label>
            <Input
              id="activity"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              placeholder="What did you work on?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pillar">Life Pillar</Label>
            <Select 
              value={formData.pillar} 
              onValueChange={(value) => setFormData({ ...formData, pillar: value as PillarType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Academics">Academics</SelectItem>
                <SelectItem value="Passions">Passions</SelectItem>
                <SelectItem value="Relationship">Relationship</SelectItem>
                <SelectItem value="Career">Career</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Only show time fields for manual entries, not for timer starts */}
          {!onStartTimer && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time (Optional)</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => {
                    setFormData({ ...formData, start_time: e.target.value });
                    setTimeout(calculateDuration, 100);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time (Optional)</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => {
                    setFormData({ ...formData, end_time: e.target.value });
                    setTimeout(calculateDuration, 100);
                  }}
                />
              </div>
            </div>
          )}

          {/* Only show duration for manual entries */}
          {!onStartTimer && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                placeholder="Duration in minutes"
                min="1"
                required
              />
            </div>
          )}


          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 
               onStartTimer && !timeLog ? 'Start Timer' : 
               timeLog ? 'Update Log' : 'Create Log'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
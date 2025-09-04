import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useVisions, type Vision } from "@/hooks/useVisions";
import { Database } from "@/integrations/supabase/types";

type PillarType = Database['public']['Enums']['pillar_type'];

interface VisionFormProps {
  vision?: Vision;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const VisionForm = ({ vision, onSuccess, trigger }: VisionFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: vision?.title || "",
    description: vision?.description || "",
    pillar: (vision?.pillar || "Health") as PillarType,
    priority: vision?.priority || "medium",
    target_date: vision?.target_date || "",
  });
  const [loading, setLoading] = useState(false);
  const { createVision, updateVision } = useVisions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (vision) {
        await updateVision(vision.id, formData);
      } else {
        await createVision(formData);
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
            New Vision
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vision ? 'Edit Vision' : 'Create New Vision'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter vision title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your vision in detail"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_date">Target Date (Optional)</Label>
            <Input
              id="target_date"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : vision ? 'Update Vision' : 'Create Vision'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
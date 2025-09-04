import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useJournals, type Journal } from "@/hooks/useJournals";
import { Database } from "@/integrations/supabase/types";

type PillarType = Database['public']['Enums']['pillar_type'];
type MoodType = Database['public']['Enums']['mood_type'];

interface JournalFormProps {
  journal?: Journal;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const JournalForm = ({ journal, onSuccess, trigger }: JournalFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: journal?.title || "",
    content: journal?.content || "",
    pillar: (journal?.pillar || "Health") as PillarType,
    mood: (journal?.mood || "neutral") as MoodType,
    entry_date: journal?.entry_date || new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const { createJournal, updateJournal } = useJournals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (journal) {
        await updateJournal(journal.id, formData);
      } else {
        await createJournal(formData);
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
            New Entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{journal ? 'Edit Journal Entry' : 'Create New Journal Entry'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter journal title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your journal entry..."
              rows={6}
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
              <Label htmlFor="mood">Mood</Label>
              <Select 
                value={formData.mood} 
                onValueChange={(value) => setFormData({ ...formData, mood: value as MoodType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="bad">Bad</SelectItem>
                  <SelectItem value="terrible">Terrible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry_date">Entry Date</Label>
            <Input
              id="entry_date"
              type="date"
              value={formData.entry_date}
              onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : journal ? 'Update Entry' : 'Create Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
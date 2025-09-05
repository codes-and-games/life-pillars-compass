import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Calendar, Heart, Meh, Frown, Pencil, Trash2, Loader2 } from "lucide-react";
import { useJournals } from "@/hooks/useJournals";
import { JournalForm } from "@/components/forms/JournalForm";

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case "happy": return <Heart className="w-4 h-4 text-success" />;
    case "neutral": return <Meh className="w-4 h-4 text-warning" />;
    case "sad": return <Frown className="w-4 h-4 text-destructive" />;
    default: return <Meh className="w-4 h-4 text-muted-foreground" />;
  }
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

export const Journals = () => {
  const { journals, loading, deleteJournal } = useJournals();

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
          <h1 className="text-3xl font-bold text-foreground">Journals</h1>
          <p className="text-muted-foreground mt-1">
            Document your thoughts, experiences, and reflections
          </p>
        </div>
        <JournalForm />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {journals.map((journal) => (
          <Card key={journal.id} className="hover-lift group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className={`${getPillarColor(journal.pillar)} text-white`}>
                  {journal.pillar}
                </Badge>
                {getMoodIcon(journal.mood)}
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                {journal.title}
              </CardTitle>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(journal.entry_date).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-1">
                  <JournalForm 
                    journal={journal} 
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-3 h-3" />
                      </Button>
                    }
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteJournal(journal.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {journal.content}
              </p>
            </CardContent>
          </Card>
        ))}

        {journals.length === 0 && (
          <Card className="hover-lift border-dashed border-2 border-muted col-span-full">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Journal Entries Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start documenting your thoughts and experiences
              </p>
              <JournalForm 
                trigger={
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    New Entry
                  </Button>
                }
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
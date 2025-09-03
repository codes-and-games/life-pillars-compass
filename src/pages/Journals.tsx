import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Calendar, Heart, Meh, Frown } from "lucide-react";

const mockJournals = [
  { 
    id: 1, 
    title: "Morning Reflections", 
    pillar: "Health", 
    mood: "happy",
    date: "2024-01-15",
    preview: "Great workout this morning. Feeling energized and ready to tackle the day..."
  },
  { 
    id: 2, 
    title: "Study Session Notes", 
    pillar: "Academics", 
    mood: "neutral",
    date: "2024-01-14",
    preview: "Completed chapter 5 of the data structures book. The concepts are getting more complex..."
  },
  { 
    id: 3, 
    title: "Creative Breakthrough", 
    pillar: "Passions", 
    mood: "happy",
    date: "2024-01-13",
    preview: "Finally figured out that melody I've been working on. The inspiration came while walking..."
  },
];

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journals</h1>
          <p className="text-muted-foreground mt-1">
            Document your thoughts, experiences, and reflections
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockJournals.map((journal) => (
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
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(journal.date).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {journal.preview}
              </p>
              <Button variant="ghost" size="sm" className="w-full">
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add new journal card */}
        <Card className="hover-lift border-dashed border-2 border-muted">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Write Your Thoughts
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a new journal entry
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
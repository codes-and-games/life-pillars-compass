import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Star } from "lucide-react";

const mockVisions = [
  { 
    id: 1, 
    title: "Become a fitness instructor", 
    pillar: "Health", 
    description: "Complete certification and start teaching classes",
    priority: "high"
  },
  { 
    id: 2, 
    title: "Master data science", 
    pillar: "Academics", 
    description: "Complete advanced courses and build portfolio projects",
    priority: "medium"
  },
  { 
    id: 3, 
    title: "Launch music album", 
    pillar: "Passions", 
    description: "Write, record, and release my first full album",
    priority: "high"
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

export const Visions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Visions</h1>
          <p className="text-muted-foreground mt-1">
            Define your long-term aspirations and dreams
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Vision
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockVisions.map((vision) => (
          <Card key={vision.id} className="hover-lift group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className={`${getPillarColor(vision.pillar)} text-white mb-2`}>
                  {vision.pillar}
                </Badge>
                {vision.priority === "high" && (
                  <Star className="w-4 h-4 text-warning fill-current" />
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                {vision.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                {vision.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  vision.priority === "high" 
                    ? "bg-warning/10 text-warning" 
                    : "bg-primary/10 text-primary"
                }`}>
                  {vision.priority} priority
                </span>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add new vision card */}
        <Card className="hover-lift border-dashed border-2 border-muted">
          <CardContent className="p-12 text-center">
            <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Create a Vision
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a new long-term goal or aspiration
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Vision
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
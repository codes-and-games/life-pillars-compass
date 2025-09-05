import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { useVisions } from "@/hooks/useVisions";
import { VisionForm } from "@/components/forms/VisionForm";

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
  const { visions, loading, deleteVision } = useVisions();

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
          <h1 className="text-3xl font-bold text-foreground">Visions</h1>
          <p className="text-muted-foreground mt-1">
            Define your long-term aspirations and dreams
          </p>
        </div>
        <VisionForm />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visions.map((vision) => (
          <Card key={vision.id} className="hover-lift group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className={`${getPillarColor(vision.pillar)} text-white mb-2`}>
                  {vision.pillar}
                </Badge>
                <div className="flex items-center space-x-1">
                  {vision.priority === "high" && (
                    <Star className="w-4 h-4 text-warning fill-current" />
                  )}
                  <VisionForm 
                    vision={vision} 
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-3 h-3" />
                      </Button>
                    }
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteVision(vision.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
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
                <span className={`text-xs ${vision.is_achieved ? 'text-success' : 'text-muted-foreground'}`}>
                  {vision.is_achieved ? 'Achieved' : 'In Progress'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {visions.length === 0 && (
          <Card className="hover-lift border-dashed border-2 border-muted col-span-full">
            <CardContent className="p-12 text-center">
              <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Visions Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start defining your long-term aspirations
              </p>
              <VisionForm 
                trigger={
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vision
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
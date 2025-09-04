import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DEFAULT_PILLARS = [
  { name: "Health", description: "Physical and mental wellbeing" },
  { name: "Academics", description: "Learning and education" },
  { name: "Passions", description: "Hobbies and creative pursuits" },
  { name: "Relationship", description: "Family, friends, and connections" },
  { name: "Career", description: "Professional growth and work" },
];

export const PillarSetup = () => {
  const [selectedPillars, setSelectedPillars] = useState<string[]>([]);
  const [customPillar, setCustomPillar] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePillarToggle = (pillarName: string) => {
    setSelectedPillars(prev => 
      prev.includes(pillarName) 
        ? prev.filter(p => p !== pillarName)
        : [...prev, pillarName]
    );
  };

  const addCustomPillar = () => {
    if (customPillar.trim() && !selectedPillars.includes(customPillar.trim())) {
      setSelectedPillars(prev => [...prev, customPillar.trim()]);
      setCustomPillar("");
    }
  };

  const removeCustomPillar = (pillar: string) => {
    if (!DEFAULT_PILLARS.some(p => p.name === pillar)) {
      setSelectedPillars(prev => prev.filter(p => p !== pillar));
    }
  };

  const useDefaultPillars = () => {
    setSelectedPillars(DEFAULT_PILLARS.map(p => p.name));
  };

  const handleComplete = async () => {
    if (!user || selectedPillars.length === 0 || !userName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your name and select at least one life pillar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update user profile with name and selected pillars
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: userName.trim(),
          // Store pillars as metadata in the auth user_metadata
        });

      if (error) throw error;

      // Store pillars in user metadata
      await supabase.auth.updateUser({
        data: { 
          name: userName.trim(),
          life_pillars: selectedPillars 
        }
      });

      toast({
        title: "Setup complete!",
        description: "Your life pillars have been configured successfully.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Life Pillars!</CardTitle>
          <p className="text-muted-foreground">
            Let's set up your personal growth journey by defining your life pillars.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Default Pillars Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Choose Your Life Pillars</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={useDefaultPillars}
              >
                Use Default Pillars
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEFAULT_PILLARS.map((pillar) => (
                <Card 
                  key={pillar.name}
                  className={`cursor-pointer transition-colors border-2 ${
                    selectedPillars.includes(pillar.name)
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handlePillarToggle(pillar.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{pillar.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pillar.description}
                        </p>
                      </div>
                      {selectedPillars.includes(pillar.name) && (
                        <Check className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Pillar Input */}
          <div className="space-y-3">
            <Label>Add Custom Pillar</Label>
            <div className="flex gap-2">
              <Input
                value={customPillar}
                onChange={(e) => setCustomPillar(e.target.value)}
                placeholder="Enter custom pillar name"
                onKeyDown={(e) => e.key === 'Enter' && addCustomPillar()}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={addCustomPillar}
                disabled={!customPillar.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Selected Pillars Display */}
          {selectedPillars.length > 0 && (
            <div className="space-y-3">
              <Label>Selected Pillars ({selectedPillars.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedPillars.map((pillar) => (
                  <Badge 
                    key={pillar} 
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {pillar}
                    {!DEFAULT_PILLARS.some(p => p.name === pillar) && (
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeCustomPillar(pillar)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Complete Button */}
          <Button 
            className="w-full"
            onClick={handleComplete}
            disabled={loading || selectedPillars.length === 0 || !userName.trim()}
          >
            {loading ? "Setting up..." : "Complete Setup"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
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
    console.log("Selected pillars:", selectedPillars);
    console.log("User name:", userName);
    console.log("User:", user);
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPillars.length === 0) {
      toast({
        title: "Select Life Pillars",
        description: "Please select at least one life pillar to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!userName.trim()) {
      toast({
        title: "Enter Your Name",
        description: "Please enter your name to continue.",
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
    <div className="min-h-screen bg-background flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">Welcome to Life Pillars!</CardTitle>
          <p className="text-muted-foreground text-sm sm:text-base">
            Let's set up your personal growth journey by defining your life pillars.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">Your Name</Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="text-sm sm:text-base"
            />
          </div>

          {/* Default Pillars Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-base sm:text-lg font-semibold">Choose Your Life Pillars</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={useDefaultPillars}
                className="text-xs sm:text-sm w-full sm:w-auto"
              >
                Use Default Pillars
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {DEFAULT_PILLARS.map((pillar) => (
                <Card 
                  key={pillar.name}
                  className={`cursor-pointer transition-colors border-2 hover:shadow-sm ${
                    selectedPillars.includes(pillar.name)
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handlePillarToggle(pillar.name)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">{pillar.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                          {pillar.description}
                        </p>
                      </div>
                      {selectedPillars.includes(pillar.name) && (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Pillar Input */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">Add Custom Pillar</Label>
            <div className="flex gap-2">
              <Input
                value={customPillar}
                onChange={(e) => setCustomPillar(e.target.value)}
                placeholder="Enter custom pillar name"
                onKeyDown={(e) => e.key === 'Enter' && addCustomPillar()}
                className="text-sm sm:text-base"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={addCustomPillar}
                disabled={!customPillar.trim()}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Selected Pillars Display */}
          {selectedPillars.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-sm sm:text-base">Selected Pillars ({selectedPillars.length})</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedPillars.map((pillar) => (
                  <Badge 
                    key={pillar} 
                    variant="secondary"
                    className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  >
                    <span className="truncate max-w-[120px]">{pillar}</span>
                    {!DEFAULT_PILLARS.some(p => p.name === pillar) && (
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive flex-shrink-0" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomPillar(pillar);
                        }}
                      />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Complete Button */}
          <Button 
            className="w-full text-sm sm:text-base py-2 sm:py-3"
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? "Setting up..." : "Complete Setup"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
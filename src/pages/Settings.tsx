import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Settings as SettingsIcon, 
  User, 
  Target, 
  AlertTriangle,
  Plus,
  X
} from "lucide-react";

const defaultPillars = [
  { name: 'Health', color: 'health' },
  { name: 'Academics', color: 'academics' },
  { name: 'Passions', color: 'passions' },
  { name: 'Relationship', color: 'relationship' },
  { name: 'Career', color: 'career' },
];

export const Settings = () => {
  const [pillars, setPillars] = useState(defaultPillars);
  const [newPillar, setNewPillar] = useState('');

  const addPillar = () => {
    if (newPillar.trim()) {
      setPillars([...pillars, { name: newPillar.trim(), color: 'primary' }]);
      setNewPillar('');
    }
  };

  const removePillar = (index: number) => {
    setPillars(pillars.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and life pillars
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" defaultValue="User" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Your age" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="streak">Current Streak</Label>
              <div className="text-2xl font-bold text-success">7 days 🔥</div>
            </div>
            
            <Button className="w-full">Update Profile</Button>
          </CardContent>
        </Card>

        {/* Pillars Management */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Life Pillars</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {pillars.map((pillar, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <Badge variant="secondary" className={`bg-${pillar.color} text-white`}>
                    {pillar.name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePillar(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={newPillar}
                onChange={(e) => setNewPillar(e.target.value)}
                placeholder="New pillar name"
                onKeyPress={(e) => e.key === 'Enter' && addPillar()}
              />
              <Button onClick={addPillar} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all your goals, visions, journals, 
                    and time logs. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground">
                    Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Warning */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-warning mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">Authentication Required</h3>
              <p className="text-muted-foreground mt-1">
                To save your data permanently and access advanced features like sync across devices, 
                you'll need to connect this app to Supabase for authentication and data storage.
              </p>
              <Button variant="outline" className="mt-3">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
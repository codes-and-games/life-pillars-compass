import { useState, useEffect } from "react";
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
  X,
  Award
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const defaultPillars = [
  { name: 'Health', color: 'health' },
  { name: 'Academics', color: 'academics' },
  { name: 'Passions', color: 'passions' },
  { name: 'Relationship', color: 'relationship' },
  { name: 'Career', color: 'career' },
];

export const Settings = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [pillars, setPillars] = useState(defaultPillars);
  const [newPillar, setNewPillar] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    age: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        age: profile.age?.toString() || ''
      });
    }
  }, [profile]);

  const addPillar = () => {
    if (newPillar.trim()) {
      setPillars([...pillars, { name: newPillar.trim(), color: 'primary' }]);
      setNewPillar('');
    }
  };

  const removePillar = (index: number) => {
    setPillars(pillars.filter((_, i) => i !== index));
  };

  const updateProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      const updates = {
        name: profileData.name,
        age: profileData.age ? parseInt(profileData.age) : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const resetAllData = async () => {
    if (!user?.id) return;

    try {
      // Delete in order: time_logs, journals, visions, goals
      await supabase.from('time_logs').delete().eq('user_id', user.id);
      await supabase.from('journals').delete().eq('user_id', user.id);
      await supabase.from('visions').delete().eq('user_id', user.id);
      await supabase.from('goals').delete().eq('user_id', user.id);

      // Reset profile streaks
      await supabase
        .from('profiles')
        .update({ 
          current_streak: 0, 
          longest_streak: 0,
          last_goal_completion_date: null 
        })
        .eq('id', user.id);

      toast({
        title: "Data Reset",
        description: "All your data has been permanently deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset data",
        variant: "destructive",
      });
    }
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
              <Input 
                id="name" 
                placeholder="Your name" 
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                placeholder="Your age" 
                value={profileData.age}
                onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Current Streak</Label>
              <div className="text-2xl font-bold text-success">
                {profile?.current_streak || 0} days {profile?.current_streak ? '🔥' : ''}
              </div>
              <div className="text-sm text-muted-foreground">
                Personal best: {profile?.longest_streak || 0} days
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={updateProfile}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
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
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground"
                    onClick={resetAllData}
                  >
                    Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      {/* Streak Info */}
      <Card className="border-success bg-success/5">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Award className="w-6 h-6 text-success mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">How Streaks Work</h3>
              <p className="text-muted-foreground mt-1">
                Complete all your daily goals each day to maintain your streak. Your streak 
                increases by 1 for each consecutive day you complete all daily goals, and resets 
                to 0 if you miss a day. Your longest streak is saved as your personal best!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
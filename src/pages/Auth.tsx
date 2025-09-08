import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Eye, Target, User, Mail, Lock } from 'lucide-react';

export const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-radial">
        <div className="text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signIn(signInData.email, signInData.password);
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signUp(signUpData.email, signUpData.password, signUpData.name);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Target className="w-10 h-10 sm:w-12 sm:h-12 text-primary mr-2 sm:mr-3" />
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Life OS</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base px-4 sm:px-0">
            Your personal growth companion
          </p>
        </div>

        <Card className="hover-lift">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-center text-lg sm:text-xl">Welcome</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
                <TabsTrigger value="signin" className="text-xs sm:text-sm">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-xs sm:text-sm">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-4 sm:mt-6">
                <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signin-email" className="flex items-center text-sm">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signin-password" className="flex items-center text-sm">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary h-9 sm:h-10 text-sm sm:text-base" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-4 sm:mt-6">
                <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center text-sm">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your name"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center text-sm">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center text-sm">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                      minLength={6}
                      className="text-sm sm:text-base h-9 sm:h-10"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary h-9 sm:h-10 text-sm sm:text-base" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground px-4 sm:px-0">
          <p>Start building your ideal life today</p>
        </div>
      </div>
    </div>
  );
};
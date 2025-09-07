import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchCommand } from "./SearchCommand";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, signOut, profile } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="hidden sm:block">
            <h2 className="text-xl font-semibold text-foreground">
              Welcome back, {profile?.name || user?.email?.split('@')[0] || 'User'}!
            </h2>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                Ready to achieve your goals today?
              </p>
              <div className="flex items-center space-x-1 bg-gradient-success/20 px-2 py-1 rounded-full">
                <span className="text-xs font-medium">🔥</span>
                <span className="text-xs font-semibold text-foreground">
                  {profile?.current_streak || 0} day streak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-8">
          <Button
            variant="outline"
            className="relative w-full justify-start text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search goals, journals, visions...
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none text-xs text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || ""} />
                  <AvatarFallback>
                    {(profile?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 border-b border-border">
                <p className="font-medium text-foreground">{profile?.name || user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs">🔥</span>
                  <span className="text-xs font-medium text-foreground">
                    {profile?.current_streak || 0} day streak
                  </span>
                </div>
              </div>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
    </header>
  );
};
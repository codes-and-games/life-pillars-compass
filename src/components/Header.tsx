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
    <header className="bg-card border-b border-border px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          
          <div className="hidden sm:block">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Welcome back, {profile?.name || user?.email?.split('@')[0] || 'User'}!
            </h2>
            <div className="flex items-center space-x-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
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
        <div className="flex-1 max-w-xs sm:max-w-lg mx-2 sm:mx-8">
          <Button
            variant="outline"
            className="relative w-full justify-start text-muted-foreground text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Search goals, journals, visions...</span>
            <span className="xs:hidden">Search...</span>
            <kbd className="pointer-events-none absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 select-none text-xs text-muted-foreground hidden sm:inline">
              ⌘K
            </kbd>
          </Button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || ""} />
                  <AvatarFallback className="text-xs sm:text-sm">
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
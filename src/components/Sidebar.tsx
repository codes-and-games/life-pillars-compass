import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Target, 
  Eye, 
  BookOpen, 
  BarChart3, 
  Clock, 
  Settings,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Visions', href: '/visions', icon: Eye },
  { name: 'Journals', href: '/journals', icon: BookOpen },
  { name: 'Time Logs', href: '/time-logs', icon: Clock },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, profile } = useAuth();
  
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Life Pillars</h1>
              <p className="text-xs text-muted-foreground">Personal Growth</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-smooth hover-lift",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 bg-gradient-success rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {(profile?.name || user?.email || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                🔥 {profile?.current_streak || 0} day streak
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Film, 
  Calendar, 
  Users, 
  TicketCheck, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin", description: "Overview of cinema operations" },
  { icon: Film, label: "Movies", path: "/admin/movies", description: "Manage movie catalog" },
  { icon: Calendar, label: "Showtimes", path: "/admin/showtimes", description: "Schedule screenings" },
  { icon: TicketCheck, label: "Bookings", path: "/admin/bookings", description: "View all reservations" },
  { icon: Users, label: "Users", path: "/admin/users", description: "Manage staff & customers" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports", description: "Analytics & insights" },
  { icon: Settings, label: "Settings", path: "/admin/settings", description: "System configuration" },
];

export const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AnimatedBackground variant="subtle" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 glass-dark border-r border-border/30 flex flex-col transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo & Close Button */}
        <div className="p-4 sm:p-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3" onClick={() => setIsSidebarOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center neon-glow-purple">
                <span className="font-display text-sm font-bold text-white">GX</span>
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">GALAXY</h1>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </Link>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-secondary/50 transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/admin" && location.pathname.startsWith(item.path));
            
            return (
              <Tooltip key={item.path} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/30 neon-border-purple"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="hidden lg:block">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 sm:p-4 border-t border-border/30">
          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-card/50">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full mt-2 sm:mt-3 justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sign out of admin portal</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass-dark border-b border-border/30">
          <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-xl hover:bg-secondary/50 transition-colors lg:hidden flex-shrink-0"
                    aria-label="Open menu"
                  >
                    <Menu className="w-5 h-5 text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Open navigation menu</p>
                </TooltipContent>
              </Tooltip>
              <div className="min-w-0">
                <h1 className="font-display text-lg sm:text-xl font-bold text-foreground truncate">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">{subtitle}</p>}
              </div>
            </div>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:underline flex-shrink-0"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">View Customer Site</span>
                  <span className="sm:hidden">Home</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Go to customer-facing website</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 relative z-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

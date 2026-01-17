import { Settings, ChevronRight, LogOut, Gift, Star, History, HelpCircle, Crown, Ticket, Film, Sparkles, QrCode } from "lucide-react";
import { currentUser } from "@/data/mockData";
import { MembershipCard } from "@/components/MembershipCard";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);
  
  const menuItems = [
    { icon: History, label: "Booking History", description: "View all your past bookings", color: "text-primary", path: "/profile/bookings" },
    { icon: Gift, label: "My Rewards", description: "Redeem your points for gifts", color: "text-accent", path: "/profile/rewards" },
    { icon: Star, label: "Favorites", description: "Movies you've saved", color: "text-primary", path: "/profile/favorites" },
    { icon: HelpCircle, label: "Help & Support", description: "Get help with your bookings", color: "text-muted-foreground", path: "/profile/help" },
    { icon: Settings, label: "Settings", description: "App preferences & notifications", color: "text-muted-foreground", path: "/profile/settings" },
  ];
  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };
  const stats = [
    { icon: Film, label: "Movies Watched", value: "24" },
    { icon: Ticket, label: "Tickets Booked", value: "32" },
    { icon: Star, label: "Reviews Given", value: "18" },
  ];

  const displayUser = user || currentUser;

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 right-0 w-full h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
          <button 
            onClick={() => navigate("/profile/settings")}
            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors active:scale-95"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg neon-glow-purple">
              {displayUser.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-lg">
              <Crown className="w-4 h-4 text-accent-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground">{displayUser.name}</h2>
            <p className="text-sm text-muted-foreground">{displayUser.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-semibold border border-accent/30">
                {displayUser.membershipTier} Member
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center p-4 rounded-2xl bg-card/30 border border-border/30">
              <stat.icon className="w-5 h-5 text-primary mb-2" />
              <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground text-center mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Membership Card */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Membership
          </h3>
          <MembershipCard user={displayUser} />
        </section>

        {/* QR Code */}
        <section 
          className="p-5 rounded-2xl bg-card/50 border border-border/50 cursor-pointer hover:bg-card/80 transition-colors active:scale-[0.98]"
          onClick={() => navigate('/profile/qr-ticket')}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Cinema Entry QR</h3>
          <div className="flex flex-col items-center">
            <div className="relative p-4 bg-white rounded-2xl shadow-lg">
              {/* QR Code Pattern */}
              <div className="w-36 h-36 grid grid-cols-9 gap-0.5">
                {Array.from({ length: 81 }).map((_, i) => {
                  // Create a more realistic QR pattern
                  const row = Math.floor(i / 9);
                  const col = i % 9;
                  const isCorner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
                  const isFilled = isCorner || Math.random() > 0.5;
                  
                  return (
                    <div
                      key={i}
                      className={cn(
                        "rounded-sm",
                        isFilled ? 'bg-background' : 'bg-white'
                      )}
                    />
                  );
                })}
              </div>
              {/* Center Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <span className="font-display text-xs font-bold text-white">GX</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm font-mono text-foreground tracking-wider">
              {currentUser.qrCode}
            </p>
            <p className="mt-1 text-xs text-muted-foreground text-center">
              Show this at the cinema gate for quick entry
            </p>
          </div>
        </section>

        {/* Menu Items */}
        <section className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary/30 transition-all duration-300 active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                <item.icon className={cn("w-5 h-5", item.color)} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </section>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-destructive/10 transition-all duration-300 text-destructive active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

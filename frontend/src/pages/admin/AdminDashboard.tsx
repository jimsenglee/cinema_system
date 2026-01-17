import { 
  TrendingUp, 
  Users, 
  Ticket, 
  DollarSign, 
  Film, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { movies, bookingHistory, showtimes } from "@/data/mockData";
import { format } from "date-fns";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Calculate stats
  const totalRevenue = bookingHistory.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalBookings = bookingHistory.length;
  const todayShowtimes = showtimes.filter(s => s.date === format(new Date(), "yyyy-MM-dd")).length;
  const activeMovies = movies.filter(m => m.status === "now_showing").length;

  const recentBookings = bookingHistory.slice(0, 5);

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your cinema operations">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                label="Total Revenue"
                value={`RM ${totalRevenue.toLocaleString()}`}
                icon={DollarSign}
                trend={{ value: 12, isPositive: true }}
                variant="primary"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Total earnings from all bookings</p>
            <p className="text-xs text-muted-foreground">Including tickets & concessions</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                label="Total Bookings"
                value={totalBookings.toString()}
                icon={Ticket}
                trend={{ value: 8, isPositive: true }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Total reservations made</p>
            <p className="text-xs text-muted-foreground">All time booking count</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                label="Today's Shows"
                value={todayShowtimes.toString()}
                icon={Calendar}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Screenings scheduled today</p>
            <p className="text-xs text-muted-foreground">Across all halls</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                label="Active Movies"
                value={activeMovies.toString()}
                icon={Film}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Currently showing movies</p>
            <p className="text-xs text-muted-foreground">Available for booking</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Bookings */}
        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Recent Bookings</h3>
            </div>
            <button 
              onClick={() => navigate("/admin/bookings")} 
              className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Ticket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent bookings</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/bookings")}>
                  <img 
                    src={booking.posterUrl} 
                    alt={booking.movieTitle}
                    className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">{booking.movieTitle}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{booking.hall} • {booking.seats.join(", ")}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {format(new Date(booking.date), "MMM d")} at {booking.time}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-accent text-sm sm:text-base">RM {booking.totalAmount}</p>
                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                      booking.status === "confirmed" 
                        ? "bg-success/20 text-success" 
                        : booking.status === "completed"
                          ? "bg-muted text-muted-foreground"
                          : "bg-destructive/20 text-destructive"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Now Showing */}
        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm sm:text-base text-foreground">Now Showing</h3>
            </div>
            <button 
              onClick={() => navigate("/admin/movies")} 
              className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
            >
              Manage Movies
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {movies.filter(m => m.status === "now_showing").slice(0, 4).map((movie) => (
              <div key={movie.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/movies")}>
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate text-sm sm:text-base">{movie.title}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{movie.genre.join(", ")}</p>
                  <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{movie.duration} min</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-accent">
                    <span className="font-semibold text-sm sm:text-base">{movie.rating}</span>
                    <span className="text-[10px] sm:text-xs">★</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{movie.language}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="lg:col-span-2 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm sm:text-base text-foreground">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { icon: Film, label: "Add Movie", description: "Add new film to catalog", color: "from-purple-500 to-pink-500", path: "/admin/movies" },
              { icon: Calendar, label: "Add Showtime", description: "Schedule a screening", color: "from-blue-500 to-cyan-500", path: "/admin/showtimes" },
              { icon: Users, label: "Manage Staff", description: "User management", color: "from-green-500 to-emerald-500", path: "/admin/users" },
              { icon: TrendingUp, label: "View Reports", description: "Analytics & insights", color: "from-orange-500 to-amber-500", path: "/admin/reports" },
            ].map((action) => (
              <Tooltip key={action.label} delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                      <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground text-center">{action.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

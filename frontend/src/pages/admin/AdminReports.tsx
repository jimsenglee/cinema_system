import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Ticket, 
  Film,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  Popcorn,
  CreditCard,
  Wallet,
  Smartphone
} from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { movies, bookingHistory, showtimes, concessionItems, mockUsers } from "@/data/mockData";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from "date-fns";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from "recharts";

// Color palette for charts
const COLORS = {
  primary: "#a855f7",
  secondary: "#ec4899",
  accent: "#f59e0b",
  success: "#22c55e",
  info: "#3b82f6",
  warning: "#eab308",
  danger: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  emerald: "#10b981",
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.info, COLORS.purple, COLORS.cyan, COLORS.emerald];

// Generate mock revenue data for the last 30 days
const generateRevenueData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const ticketRevenue = Math.floor(Math.random() * 5000) + 2000;
    const concessionRevenue = Math.floor(Math.random() * 2000) + 800;
    data.push({
      date: format(date, "MMM dd"),
      fullDate: format(date, "yyyy-MM-dd"),
      tickets: ticketRevenue,
      concessions: concessionRevenue,
      total: ticketRevenue + concessionRevenue,
    });
  }
  return data;
};

// Generate mock hourly data for today
const generateHourlyData = () => {
  const hours = [];
  for (let i = 10; i <= 23; i++) {
    const bookings = i >= 18 && i <= 21 ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 15) + 5;
    hours.push({
      hour: `${i}:00`,
      bookings,
      revenue: bookings * (Math.floor(Math.random() * 20) + 30),
    });
  }
  return hours;
};

// Generate genre popularity data
const generateGenreData = () => {
  const genres: { [key: string]: number } = {};
  movies.forEach(movie => {
    movie.genre.forEach(g => {
      genres[g] = (genres[g] || 0) + Math.floor(Math.random() * 100) + 50;
    });
  });
  return Object.entries(genres)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
};

// Generate movie performance data
const generateMoviePerformance = () => {
  return movies
    .filter(m => m.status === "now_showing")
    .slice(0, 8)
    .map(movie => ({
      name: movie.title.length > 15 ? movie.title.substring(0, 15) + "..." : movie.title,
      fullName: movie.title,
      tickets: Math.floor(Math.random() * 500) + 200,
      revenue: Math.floor(Math.random() * 15000) + 5000,
      rating: movie.rating,
      occupancy: Math.floor(Math.random() * 40) + 60,
    }));
};

// Generate hall utilization data
const generateHallUtilization = () => {
  return [
    { name: "Hall 1 (IMAX)", utilization: 85, capacity: 120, fill: COLORS.primary },
    { name: "Hall 2 (Dolby)", utilization: 72, capacity: 80, fill: COLORS.secondary },
    { name: "Hall 3 (Standard)", utilization: 68, capacity: 150, fill: COLORS.accent },
    { name: "Hall 4 (4DX)", utilization: 91, capacity: 60, fill: COLORS.success },
  ];
};

// Generate payment method data
const generatePaymentData = () => [
  { name: "Credit Card", value: 45, icon: CreditCard },
  { name: "Debit Card", value: 25, icon: CreditCard },
  { name: "E-Wallet", value: 20, icon: Wallet },
  { name: "Touch n Go", value: 10, icon: Smartphone },
];

// Generate weekly comparison data
const generateWeeklyComparison = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(day => ({
    day,
    thisWeek: Math.floor(Math.random() * 100) + 50,
    lastWeek: Math.floor(Math.random() * 100) + 40,
  }));
};

// Generate concession sales data
const generateConcessionData = () => {
  const categories = ["Popcorn", "Drinks", "Snacks", "Combos"];
  return categories.map(cat => {
    const items = concessionItems.filter(i => i.category === cat);
    return {
      category: cat,
      sales: items.reduce((acc, item) => acc + Math.floor(Math.random() * 100) * item.price, 0),
      items: items.length,
    };
  });
};

const AdminReports = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate data
  const revenueData = generateRevenueData();
  const hourlyData = generateHourlyData();
  const genreData = generateGenreData();
  const moviePerformance = generateMoviePerformance();
  const hallUtilization = generateHallUtilization();
  const paymentData = generatePaymentData();
  const weeklyComparison = generateWeeklyComparison();
  const concessionData = generateConcessionData();

  // Calculate totals
  const totalRevenue = revenueData.reduce((acc, d) => acc + d.total, 0);
  const totalTickets = revenueData.reduce((acc, d) => acc + d.tickets, 0);
  const totalConcessions = revenueData.reduce((acc, d) => acc + d.concessions, 0);
  const avgDailyRevenue = Math.round(totalRevenue / revenueData.length);
  const totalBookings = bookingHistory.length * 50; // Mock multiplier
  const avgOccupancy = Math.round(hallUtilization.reduce((acc, h) => acc + h.utilization, 0) / hallUtilization.length);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Reports data refreshed");
    }, 1500);
  };

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} report...`, {
      description: "Your download will start shortly"
    });
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/50 rounded-lg shadow-xl">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name.includes('Revenue') 
                ? `RM ${entry.value.toLocaleString()}` 
                : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout title="Reports & Analytics" subtitle="Comprehensive insights into your cinema operations">
      {/* Header Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px] sm:w-[180px] glass-card border-border/50 text-xs sm:text-sm">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="glass-card border-border/50 h-9 w-9 sm:h-10 sm:w-10"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport("PDF")}
            className="glass-card border-border/50 text-xs sm:text-sm"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Export </span>PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport("Excel")}
            className="glass-card border-border/50 text-xs sm:text-sm"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Export </span>Excel
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <GlassCard className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider truncate">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">RM {totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success flex-shrink-0" />
                <span className="text-[10px] sm:text-xs text-success">+12.5%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">vs last period</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider truncate">Total Bookings</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">{totalBookings.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success flex-shrink-0" />
                <span className="text-[10px] sm:text-xs text-success">+8.3%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">vs last period</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center flex-shrink-0">
              <Ticket className="w-4 h-4 sm:w-6 sm:h-6 text-secondary" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider truncate">Avg Occupancy</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">{avgOccupancy}%</p>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-destructive flex-shrink-0" />
                <span className="text-[10px] sm:text-xs text-destructive">-2.1%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">vs last period</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-accent" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider truncate">Avg Daily Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">RM {avgDailyRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success flex-shrink-0" />
                <span className="text-[10px] sm:text-xs text-success">+5.7%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">vs last period</span>
              </div>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-success" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Charts Section */}
      <Tabs defaultValue="revenue" className="mb-4 sm:mb-6">
        <TabsList className="glass-card border border-border/50 p-0.5 sm:p-1 mb-3 sm:mb-4 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm px-2 sm:px-3">
            <LineChartIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Revenue</span>
            <span className="sm:hidden">Rev</span>
          </TabsTrigger>
          <TabsTrigger value="movies" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm px-2 sm:px-3">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Movies
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm px-2 sm:px-3">
            <PieChartIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4 sm:space-y-6">
          {/* Revenue Trend Chart */}
          <GlassCard className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-foreground">Revenue Trend</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Daily revenue breakdown for the selected period</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Tickets</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">Concessions</span>
                </div>
              </div>
            </div>
            <div className="h-[250px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConcessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 11 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="tickets" 
                    name="Ticket Revenue"
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTickets)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="concessions" 
                    name="Concession Revenue"
                    stroke={COLORS.secondary} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorConcessions)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Hourly Bookings */}
            <GlassCard className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Today's Hourly Bookings</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Booking distribution throughout the day</p>
              <div className="h-[200px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 9 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 9 }}
                      width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="bookings" 
                      name="Bookings"
                      fill={COLORS.primary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Weekly Comparison */}
            <GlassCard className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Weekly Comparison</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">This week vs last week performance</p>
              <div className="h-[200px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 9 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 9 }}
                      width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px', fontSize: '10px' }}
                      formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                    />
                    <Bar dataKey="thisWeek" name="This Week" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lastWeek" name="Last Week" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Movies Tab */}
        <TabsContent value="movies" className="space-y-4 sm:space-y-6">
          {/* Top Movies Performance */}
          <GlassCard className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-foreground">Top Performing Movies</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Currently showing movies ranked by revenue</p>
              </div>
            </div>
            <div className="h-[250px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={moviePerformance} 
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    type="number" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 9 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 9 }}
                    width={70}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '10px' }}
                    formatter={(value) => <span className="text-[10px] sm:text-xs text-muted-foreground">{value}</span>}
                  />
                  <Bar dataKey="revenue" name="Revenue (RM)" fill={COLORS.primary} radius={[0, 4, 4, 0]} barSize={16} />
                  <Line type="monotone" dataKey="tickets" name="Tickets Sold" stroke={COLORS.accent} strokeWidth={2} dot={{ fill: COLORS.accent, strokeWidth: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Genre Popularity */}
            <GlassCard className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Genre Popularity</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Ticket sales by movie genre</p>
              <div className="h-[200px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 8 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888', fontSize: 9 }}
                      width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Tickets Sold" radius={[4, 4, 0, 0]}>
                      {genreData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Movie Details Table */}
            <GlassCard className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Movie Performance Details</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Detailed breakdown by movie</p>
              <div className="space-y-2 sm:space-y-3 max-h-[200px] sm:max-h-[300px] overflow-y-auto pr-1 sm:pr-2">
                {moviePerformance.map((movie, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xs sm:text-sm font-bold text-primary flex-shrink-0">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-xs sm:text-sm truncate">{movie.fullName}</p>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1">
                        <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                          <Ticket className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {movie.tickets}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" /> {movie.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-accent text-xs sm:text-sm">RM {movie.revenue.toLocaleString()}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{movie.occupancy}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Hall Utilization */}
            <GlassCard className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Hall Utilization</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Average seat occupancy by hall</p>
              <div className="h-[200px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="100%" 
                    barSize={14} 
                    data={hallUtilization}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      label={{ position: 'insideStart', fill: '#fff', fontSize: 9 }}
                      background={{ fill: 'rgba(255,255,255,0.1)' }}
                      dataKey="utilization"
                    />
                    <Legend 
                      iconSize={8}
                      layout="horizontal"
                      verticalAlign="bottom"
                      wrapperStyle={{ fontSize: '10px' }}
                      formatter={(value) => <span className="text-[10px] sm:text-xs text-muted-foreground">{value}</span>}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Utilization']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Payment Methods */}
            <GlassCard className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Payment Methods</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Distribution of payment preferences</p>
              <div className="h-[200px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      label={false}
                      labelLine={false}
                    >
                      {paymentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Share']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                      formatter={(value) => <span className="text-[10px] sm:text-xs text-muted-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Concession Sales */}
          <GlassCard className="p-3 sm:p-6">
            <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">Concession Sales by Category</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Revenue breakdown for food and beverages</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {concessionData.map((cat, index) => (
                <div key={cat.category} className="p-2 sm:p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${CHART_COLORS[index]}20` }}
                    >
                      <Popcorn className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: CHART_COLORS[index] }} />
                    </div>
                    <span className="font-medium text-xs sm:text-sm text-foreground truncate">{cat.category}</span>
                  </div>
                  <p className="text-base sm:text-xl font-bold text-foreground">RM {cat.sales.toLocaleString()}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{cat.items} items</p>
                </div>
              ))}
            </div>
            <div className="h-[150px] sm:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={concessionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 9 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 9 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" name="Sales (RM)" radius={[4, 4, 0, 0]}>
                    {concessionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* User Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <GlassCard className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">{mockUsers.length * 150}</p>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">New this month</span>
                  <span className="text-success">+124</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Active users</span>
                  <span className="text-foreground">89%</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">4.7</p>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Total reviews</span>
                  <span className="text-foreground">1,234</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">5-star reviews</span>
                  <span className="text-foreground">68%</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Peak Hours</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">7-9 PM</p>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Busiest day</span>
                  <span className="text-foreground">Saturday</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Avg wait time</span>
                  <span className="text-foreground">3 min</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminReports;

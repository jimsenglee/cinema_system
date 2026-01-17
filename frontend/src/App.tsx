import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { BottomNav } from "@/components/BottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import ConcessionsPage from "./pages/ConcessionsPage";
import CheckoutPage from "./pages/CheckoutPage";
import TicketsPage from "./pages/TicketsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminShowtimes from "./pages/admin/AdminShowtimes";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import QRTicketPage from "./pages/profile/QRTicketPage";
import BookingHistoryPage from "./pages/profile/BookingHistoryPage";
import BookingDetailPage from "./pages/profile/BookingDetailPage";
import RewardsPage from "./pages/profile/RewardsPage";
import FavoritesPage from "./pages/profile/FavoritesPage";
import HelpPage from "./pages/profile/HelpPage";
import SettingsPage from "./pages/profile/SettingsPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import MoviesPage from "./pages/MoviesPage";
import { ReactNode } from "react";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper (requires admin or staff role)
const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (user?.role !== "admin" && user?.role !== "staff") {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Auth route wrapper (redirects to home if already logged in)
const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Layout with bottom nav
const MainLayout = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <BottomNav />
  </>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/auth/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
      <Route path="/auth/forgot-password" element={<AuthRoute><ForgotPasswordPage /></AuthRoute>} />
      
      {/* Main Customer Routes */}
      <Route path="/" element={<MainLayout><Index /></MainLayout>} />
      <Route path="/movies" element={<MainLayout><MoviesPage /></MainLayout>} />
      <Route path="/movies/genre/:genre" element={<MainLayout><MoviesPage /></MainLayout>} />
      <Route path="/movies/coming-soon" element={<MainLayout><MoviesPage /></MainLayout>} />
      <Route path="/movies/now-showing" element={<MainLayout><MoviesPage /></MainLayout>} />
      <Route path="/movie/:id" element={<MainLayout><MovieDetailsPage /></MainLayout>} />
      <Route path="/seats" element={<MainLayout><SeatSelectionPage /></MainLayout>} />
      <Route path="/concessions" element={<MainLayout><ConcessionsPage /></MainLayout>} />
      <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
      <Route path="/tickets" element={<MainLayout><TicketsPage /></MainLayout>} />
      <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
      
      {/* Profile Sub-Routes */}
      <Route path="/profile/qr-ticket" element={<MainLayout><QRTicketPage /></MainLayout>} />
      <Route path="/profile/bookings" element={<MainLayout><BookingHistoryPage /></MainLayout>} />
      <Route path="/profile/bookings/:id" element={<MainLayout><BookingDetailPage /></MainLayout>} />
      <Route path="/profile/rewards" element={<MainLayout><RewardsPage /></MainLayout>} />
      <Route path="/profile/favorites" element={<MainLayout><FavoritesPage /></MainLayout>} />
      <Route path="/profile/help" element={<MainLayout><HelpPage /></MainLayout>} />
      <Route path="/profile/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/movies" element={<AdminRoute><AdminMovies /></AdminRoute>} />
      <Route path="/admin/showtimes" element={<AdminRoute><AdminShowtimes /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookingProvider>
          <Toaster />
          <Sonner 
            position="top-center" 
            toastOptions={{
              classNames: {
                toast: "glass-card border-border/50",
                title: "text-foreground",
                description: "text-muted-foreground",
              }
            }}
          />
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-background">
              <AppRoutes />
            </div>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

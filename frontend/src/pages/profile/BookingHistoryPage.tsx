import { PageContainer } from "@/components/layouts/PageContainer";
import { useState } from "react";
import { Calendar, Clock, MapPin, Ticket, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/formatters";

// Mock booking data
const mockBookings = [
  {
    id: "BK001",
    movieTitle: "Dune: Part Two",
    posterUrl: "/placeholder.svg",
    date: "2026-01-20",
    time: "19:30",
    cinema: "CineverseHub Central",
    hall: "Hall 1 - IMAX",
    seats: ["A5", "A6"],
    status: "confirmed",
    total: 45.00,
    reference: "CH-2026-001"
  },
  {
    id: "BK002",
    movieTitle: "Oppenheimer",
    posterUrl: "/placeholder.svg",
    date: "2026-01-15",
    time: "14:00",
    cinema: "CineverseHub Downtown",
    hall: "Hall 3 - Standard",
    seats: ["C3", "C4"],
    status: "completed",
    total: 30.00,
    reference: "CH-2026-002"
  },
  {
    id: "BK003",
    movieTitle: "The Batman",
    posterUrl: "/placeholder.svg",
    date: "2026-01-10",
    time: "20:00",
    cinema: "CineverseHub Central",
    hall: "Hall 2 - Dolby",
    seats: ["B5"],
    status: "cancelled",
    total: 20.00,
    reference: "CH-2026-003"
  }
];

const BookingHistoryPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const filterBookings = (status: string) => {
    if (status === "all") return mockBookings;
    return mockBookings.filter(b => b.status === status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-primary/20 text-primary border-primary/30";
      case "completed": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "cancelled": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <PageContainer title="Booking History">
      <div className="space-y-4">
        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary/30">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="confirmed">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3 mt-4">
            {filterBookings(activeTab).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Ticket className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              filterBookings(activeTab).map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-2xl bg-card/50 border border-border/50 hover:bg-card/80 transition-colors cursor-pointer active:scale-[0.98]"
                  onClick={() => navigate(`/profile/bookings/${booking.id}`)}
                >
                  {/* Movie Info */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-24 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                      <img 
                        src={booking.posterUrl} 
                        alt={booking.movieTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-foreground truncate mb-1">
                        {booking.movieTitle}
                      </h3>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-primary" />
                          {format(new Date(booking.date), "EEE, d MMM yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          {booking.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {booking.hall}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground">Seats: {booking.seats.join(", ")}</p>
                      <p className="text-sm font-mono text-foreground font-semibold mt-1">
                        {formatPrice(booking.total)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default BookingHistoryPage;

import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Info, Sparkles } from "lucide-react";
import { getSeatsForHall, getSeatStatusForShowtime } from "@/data/mockData";
import { SeatGrid } from "@/components/SeatGrid";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/BookingContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

const SeatSelectionPage = () => {
  const navigate = useNavigate();
  const { movie, showtime, selectedSeats, toggleSeat, setSeatDetails, ticketTotal } = useBooking();

  useEffect(() => {
    if (!movie || !showtime) {
      navigate("/");
    }
  }, [movie, showtime, navigate]);

  const seats = useMemo(() => {
    if (!showtime) return [];
    return getSeatsForHall(showtime.hallId);
  }, [showtime]);

  const seatStatuses = useMemo(() => {
    if (!showtime) return [];
    return getSeatStatusForShowtime(showtime.id);
  }, [showtime]);

  useEffect(() => {
    setSeatDetails(seats);
  }, [selectedSeats, seats, setSeatDetails]);

  const selectedSeatLabels = useMemo(() => {
    return seats
      .filter(s => selectedSeats.includes(s.id))
      .map(s => `${s.row}${s.number}`)
      .join(", ");
  }, [seats, selectedSeats]);

  if (!movie || !showtime) return null;

  return (
    <div className="min-h-screen bg-background pb-52">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-40 bg-gradient-to-b from-primary/10 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-lg font-bold text-foreground truncate">
                {movie.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-primary" />
                  {format(new Date(showtime.date), "EEE, d MMM")}
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  {showtime.time}
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  {showtime.hallName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hall Type Badge */}
      <div className="flex justify-center py-4">
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 neon-border-purple">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-primary text-sm font-semibold tracking-wide">{showtime.hallType} Experience</span>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-center gap-6 p-3 rounded-xl bg-card/30 border border-border/30">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Standard</p>
            <p className="text-sm font-semibold text-foreground">RM {showtime.price}</p>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">VIP</p>
            <p className="text-sm font-semibold text-primary">RM {(showtime.price * 1.5).toFixed(0)}</p>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Twin</p>
            <p className="text-sm font-semibold text-accent">RM {(showtime.price * 2.5).toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="w-full px-2 sm:px-4">
        <SeatGrid
          seats={seats}
          seatStatuses={seatStatuses}
          selectedSeats={selectedSeats}
          onSeatSelect={toggleSeat}
        />
      </div>

      {/* Tip */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 mt-2 sm:mt-4">
        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center">Tap a seat to select</p>
      </div>

      {/* Footer */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500",
        selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="bg-background/95 backdrop-blur-md border-t border-border/40 p-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedSeats.length} {selectedSeats.length === 1 ? "Seat" : "Seats"} Selected
              </p>
              <p className="text-sm font-medium text-foreground">{selectedSeatLabels}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-display text-2xl font-bold text-accent neon-text-gold">
                {formatPrice(ticketTotal)}
              </p>
            </div>
          </div>
          <Button
            variant="cinema"
            size="xl"
            className="w-full"
            onClick={() => navigate("/concessions")}
          >
            Continue to Add-ons
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;

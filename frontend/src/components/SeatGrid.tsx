import { useMemo } from "react";
import { Seat, SeatStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Armchair, Crown, Users, Accessibility } from "lucide-react";

interface SeatGridProps {
  seats: Seat[];
  seatStatuses: SeatStatus[];
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

export const SeatGrid = ({ seats, seatStatuses, selectedSeats, onSeatSelect }: SeatGridProps) => {
  const statusMap = useMemo(() => {
    const map = new Map<string, SeatStatus["status"]>();
    seatStatuses.forEach(s => map.set(s.seatId, s.status));
    return map;
  }, [seatStatuses]);

  const gridData = useMemo(() => {
    const maxX = Math.max(...seats.map(s => s.gridX)) + 1;
    const maxY = Math.max(...seats.map(s => s.gridY)) + 1;
    const seatMap = new Map<string, Seat>();
    seats.forEach(s => seatMap.set(`${s.gridX}-${s.gridY}`, s));
    
    const rows = Array.from({ length: maxY }, (_, y) => y + 1);
    const cols = Array.from({ length: maxX }, (_, x) => x + 1);
    
    return { rows, cols, seatMap, maxX };
  }, [seats]);

  const getSeatStyle = (seat: Seat, status: SeatStatus["status"], isSelected: boolean) => {
    if (isSelected) {
      return "bg-neon-green border-neon-green text-background neon-glow-green scale-110";
    }
    
    switch (status) {
      case "booked":
        return "bg-seat-booked border-seat-booked text-muted-foreground/50 cursor-not-allowed";
      case "locked":
        return "bg-seat-locked/50 border-seat-locked text-destructive cursor-not-allowed animate-pulse";
      default:
        if (seat.type === "VIP") {
          return "border-primary text-primary hover:bg-primary/20 hover:scale-105 cursor-pointer";
        }
        if (seat.type === "Twin") {
          return "border-accent text-accent hover:bg-accent/20 hover:scale-105 cursor-pointer";
        }
        return "border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground hover:scale-105 cursor-pointer";
    }
  };

  const getSeatIcon = (type: Seat["type"]) => {
    switch (type) {
      case "VIP":
        return Crown;
      case "Twin":
        return Users;
      case "Wheelchair":
        return Accessibility;
      default:
        return Armchair;
    }
  };

  const handleSeatClick = (seat: Seat) => {
    const status = statusMap.get(seat.id) || "available";
    if (status !== "available") return;
    onSeatSelect(seat.id);
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8 py-4 w-full max-w-full overflow-hidden">
      {/* Screen */}
      <div className="relative w-full max-w-xs sm:max-w-sm px-4">
        <div className="relative h-8 sm:h-12 overflow-hidden">
          <div className="absolute inset-x-4 bottom-0 h-1.5 sm:h-2 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-full" />
          <div className="absolute inset-x-0 bottom-1.5 sm:bottom-2 h-6 sm:h-10 screen-curve" />
        </div>
        <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-1 font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase">
          Screen
        </p>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col gap-1 sm:gap-2 px-1 sm:px-2 w-full overflow-x-auto hide-scrollbar">
        {gridData.rows.map((y) => {
          const rowSeats = seats.filter(s => s.gridY === y);
          if (rowSeats.length === 0) return null;
          const rowLabel = rowSeats[0]?.row;
          
          return (
            <div key={y} className="flex items-center gap-0.5 sm:gap-1.5 justify-center min-w-fit">
              {/* Row Label */}
              <span className="w-4 sm:w-6 text-[10px] sm:text-xs text-muted-foreground font-bold text-center flex-shrink-0">
                {rowLabel}
              </span>
              
              {/* Seats */}
              <div className="flex gap-0.5 sm:gap-1.5">
                {gridData.cols.map((x) => {
                  const seat = gridData.seatMap.get(`${x}-${y}`);
                  
                  if (!seat) {
                    // Check if this is the aisle gap
                    const midPoint = gridData.maxX / 2 + 1;
                    if (x === midPoint || x === midPoint + 1) {
                      return <div key={`gap-${x}`} className="w-1.5 sm:w-3" />;
                    }
                    return <div key={`empty-${x}`} className="w-6 h-6 sm:w-8 sm:h-8" />;
                  }

                  const status = statusMap.get(seat.id) || "available";
                  const isSelected = selectedSeats.includes(seat.id);
                  const SeatIcon = getSeatIcon(seat.type);
                  
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={status !== "available"}
                      className={cn(
                        "w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border sm:border-2 flex items-center justify-center transition-all duration-200",
                        seat.type === "Twin" && "w-12 sm:w-16",
                        getSeatStyle(seat, status, isSelected)
                      )}
                      title={`${seat.row}${seat.number} - ${seat.type} ${status !== "available" ? `(${status})` : ""}`}
                    >
                      <SeatIcon className={cn("w-3 h-3 sm:w-4 sm:h-4", seat.type === "Twin" && "w-4 h-4 sm:w-5 sm:h-5")} />
                    </button>
                  );
                })}
              </div>
              
              {/* Row Label (right side) */}
              <span className="w-4 sm:w-6 text-[10px] sm:text-xs text-muted-foreground font-bold text-center flex-shrink-0">
                {rowLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-x-3 sm:gap-x-6 gap-y-2 sm:gap-y-3 mt-2 px-2 sm:px-4 w-full">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg border sm:border-2 border-muted-foreground/50 flex items-center justify-center">
            <Armchair className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground/50" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-neon-green border sm:border-2 border-neon-green flex items-center justify-center">
            <Armchair className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-background" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-seat-booked border sm:border-2 border-seat-booked flex items-center justify-center">
            <Armchair className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground/50" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg border sm:border-2 border-primary flex items-center justify-center">
            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground">VIP</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 col-span-2 sm:col-span-1">
          <div className="w-8 sm:w-10 h-5 sm:h-6 rounded-md sm:rounded-lg border sm:border-2 border-accent flex items-center justify-center">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Twin</span>
        </div>
      </div>
    </div>
  );
};

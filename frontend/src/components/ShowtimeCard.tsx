import { Showtime } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ShowtimeCardProps {
  showtime: Showtime;
  onClick?: () => void;
}

export const ShowtimeCard = ({ showtime, onClick }: ShowtimeCardProps) => {
  const getHallTypeColor = (type: string) => {
    switch (type) {
      case "IMAX":
        return "text-accent border-accent/50 bg-accent/10";
      case "Dolby":
        return "text-primary border-primary/50 bg-primary/10";
      case "4DX":
        return "text-neon-green border-neon-green/50 bg-neon-green/10";
      default:
        return "text-muted-foreground border-border bg-secondary/50";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-300",
        "bg-card/50 border-border/50 hover:border-primary/50 hover:bg-primary/5",
        "active:scale-95"
      )}
    >
      <span className="flex items-center gap-1 text-lg font-semibold text-foreground">
        <Clock className="w-4 h-4 text-muted-foreground" />
        {showtime.time}
      </span>
      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", getHallTypeColor(showtime.hallType))}>
        {showtime.hallType}
      </span>
      <span className="text-xs text-muted-foreground">
        from RM {showtime.price}
      </span>
    </button>
  );
};

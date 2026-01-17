import { Star, Play, Clock } from "lucide-react";
import { Movie } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  variant?: "poster" | "featured";
  onClick?: () => void;
}

export const MovieCard = ({ movie, variant = "poster", onClick }: MovieCardProps) => {
  if (variant === "featured") {
    return (
      <div
        onClick={onClick}
        className="relative w-64 h-80 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm neon-glow-purple">
            <Play className="w-7 h-7 text-primary-foreground ml-1" />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-semibold border border-primary/30">
              {movie.genre[0]}
            </span>
          </div>
          <h3 className="font-display text-base font-bold text-foreground mb-1 line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-foreground font-semibold">{movie.rating}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {movie.duration}m
            </span>
          </div>
        </div>
        
        {/* Border glow on hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-all duration-300 group-hover:neon-border-purple" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer group",
        "w-full aspect-[2/3]"
      )}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Title on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-xs font-semibold text-foreground line-clamp-2">{movie.title}</p>
      </div>
      
      {/* Rating badge */}
      <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50">
        <Star className="w-3 h-3 text-accent fill-accent" />
        <span className="text-xs font-bold text-foreground">{movie.rating}</span>
      </div>
      
      {/* Hover border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/40 rounded-xl transition-all duration-300" />
    </div>
  );
};

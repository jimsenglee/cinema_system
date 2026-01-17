import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Clock, Star, Calendar, Languages, Users } from "lucide-react";
import { movies, showtimes, type Movie } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShowtimeCard } from "@/components/ShowtimeCard";
import { MovieStatusBadge } from "@/components/ui/StatusBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { InfoRow } from "@/components/ui/InfoCard";
import { formatDuration, formatDate } from "@/lib/formatters";
import { useBooking } from "@/context/BookingContext";

/**
 * Movie Details Page
 * 
 * Displays comprehensive movie information including:
 * - Poster and backdrop
 * - Synopsis and details
 * - Cast and crew
 * - Available showtimes
 * - Ratings and age restrictions
 */
export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setMovie, setShowtime } = useBooking();

  // Find movie by ID
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
          <p className="text-white/60 mb-4">The movie you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Get showtimes for this movie
  const movieShowtimes = showtimes.filter((s) => s.movieId === movie.id);

  const handleBookNow = () => {
    setMovie(movie);
    // Scroll to showtimes section
    document.getElementById("showtimes")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShowtimeClick = (showtimeId: string) => {
    const showtime = movieShowtimes.find((s) => s.id === showtimeId);
    if (showtime) {
      setMovie(movie);
      setShowtime(showtime);
      navigate("/seats");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Backdrop Image with Overlay */}
      <div className="relative h-[50vh] overflow-hidden">
        <ImageWithFallback
          src={movie.backdropUrl}
          alt={movie.title}
          containerClassName="absolute inset-0"
          className="object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-32 z-10 px-4">
        {/* Poster and Basic Info */}
        <div className="flex gap-4 mb-6">
          {/* Poster */}
          <div className="w-32 flex-shrink-0">
            <ImageWithFallback
              src={movie.posterUrl}
              alt={movie.title}
              containerClassName="rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/10"
              className="aspect-[2/3]"
            />
          </div>

          {/* Title and Meta */}
          <div className="flex-1 pt-8">
            <MovieStatusBadge status={movie.status} className="mb-2" />
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            
            {/* Rating and Duration */}
            <div className="flex items-center gap-3 text-sm text-white/80 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{movie.rating}</span>
              </div>
              <span className="text-white/40">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(movie.duration)}</span>
              </div>
              <span className="text-white/40">•</span>
              <Badge variant="outline" className="border-white/20">
                {movie.ageRating}
              </Badge>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <Badge 
                  key={g} 
                  className="bg-primary/20 text-primary border-primary/30"
                >
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {movie.status === "now_showing" && movieShowtimes.length > 0 && (
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleBookNow}
              size="lg"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Book Tickets
            </Button>
          </div>
        )}

        {/* Synopsis */}
        <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-2">Synopsis</h2>
          <p className="text-white/70 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>

        {/* Movie Details */}
        <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <h2 className="text-lg font-semibold text-white mb-3">Details</h2>
          <div className="space-y-2">
            <InfoRow 
              label="Director" 
              value={movie.director}
            />
            <InfoRow 
              label="Language" 
              value={
                <div className="flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  {movie.language}
                </div>
              }
            />
            <InfoRow 
              label="Release Date" 
              value={
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(movie.releaseDate, "long")}
                </div>
              }
            />
          </div>
        </div>

        {/* Cast */}
        <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Cast</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.cast.map((actor) => (
              <Badge 
                key={actor}
                variant="outline" 
                className="bg-zinc-800 border-zinc-700 text-white"
              >
                {actor}
              </Badge>
            ))}
          </div>
        </div>

        {/* Showtimes Section */}
        {movie.status === "now_showing" && movieShowtimes.length > 0 && (
          <div id="showtimes" className="scroll-mt-20">
            <SectionHeader 
              title="Showtimes"
              subtitle="Select a showtime to continue booking"
              size="lg"
              className="mb-4"
            />
            
            <div className="space-y-3">
              {movieShowtimes.slice(0, 10).map((showtime, idx) => (
                <div
                  key={showtime.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <ShowtimeCard 
                    showtime={showtime}
                    onClick={() => handleShowtimeClick(showtime.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Message */}
        {movie.status === "coming_soon" && (
          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-center">
            <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-white/60">
              This movie will be released on {formatDate(movie.releaseDate, "long")}
            </p>
          </div>
        )}

        {/* Ended Message */}
        {movie.status === "ended" && (
          <div className="p-6 rounded-xl bg-gradient-to-r from-zinc-500/10 to-gray-500/10 border border-zinc-500/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">No Longer Showing</h3>
            <p className="text-white/60">
              This movie is no longer available in theaters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

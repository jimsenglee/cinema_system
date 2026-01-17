import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import { movies, genres, languages } from "@/data/mockData";
import { MovieCard } from "@/components/MovieCard";
import { FilterChips } from "@/components/FilterChips";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Movies Browsing Page
 * 
 * Features:
 * - Grid view of all movies
 * - Search functionality
 * - Filter by genre, language, status
 * - Sort by rating, title, release date
 */
export default function MoviesPage() {
  const navigate = useNavigate();
  const { genre } = useParams<{ genre: string }>();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "now_showing" | "coming_soon" | "ended">("all");
  const [sortBy, setSortBy] = useState<"rating" | "title" | "release_date">("rating");
  
  // Handle route-based filtering
  useEffect(() => {
    if (genre) {
      // Genre route: /movies/genre/:genre
      setSelectedGenre(genre);
      setSelectedStatus("all");
    } else if (location.pathname === "/movies/coming-soon") {
      setSelectedStatus("coming_soon");
      setSelectedGenre("All");
    } else if (location.pathname === "/movies/now-showing") {
      setSelectedStatus("now_showing");
      setSelectedGenre("All");
    } else if (location.pathname === "/movies") {
      // Reset filters for main movies page
      // Keep current filters
    }
  }, [genre, location.pathname]);
  
  // Debounce search for better performance
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // Filter by search query
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.synopsis.toLowerCase().includes(query) ||
          m.director.toLowerCase().includes(query) ||
          m.cast.some((c) => c.toLowerCase().includes(query))
      );
    }

    // Filter by genre
    if (selectedGenre !== "All") {
      filtered = filtered.filter((m) => m.genre.includes(selectedGenre));
    }

    // Filter by language
    if (selectedLanguage !== "All") {
      filtered = filtered.filter((m) => m.language === selectedLanguage);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((m) => m.status === selectedStatus);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        case "release_date":
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [debouncedSearch, selectedGenre, selectedLanguage, selectedStatus, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedGenre !== "All") count++;
    if (selectedLanguage !== "All") count++;
    if (selectedStatus !== "all") count++;
    return count;
  }, [selectedGenre, selectedLanguage, selectedStatus]);

  const clearFilters = () => {
    setSelectedGenre("All");
    setSelectedLanguage("All");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 pb-3">
        <div className="px-4 pt-4">
          <SectionHeader 
            title="Browse Movies" 
            subtitle={`${filteredMovies.length} ${filteredMovies.length === 1 ? 'movie' : 'movies'} found`}
            size="lg"
          />
          
          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, directors, actors..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-white/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={selectedStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("all")}
              className={cn(
                selectedStatus === "all" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600" 
                  : "border-zinc-700 text-white/70 hover:text-white hover:bg-zinc-800"
              )}
            >
              All
            </Button>
            <Button
              variant={selectedStatus === "now_showing" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("now_showing")}
              className={cn(
                selectedStatus === "now_showing" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                  : "border-zinc-700 text-white/70 hover:text-white hover:bg-zinc-800"
              )}
            >
              Now Showing
            </Button>
            <Button
              variant={selectedStatus === "coming_soon" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("coming_soon")}
              className={cn(
                selectedStatus === "coming_soon" 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                  : "border-zinc-700 text-white/70 hover:text-white hover:bg-zinc-800"
              )}
            >
              Coming Soon
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 space-y-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium text-white">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-white/60 hover:text-white"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Genre Filter */}
        <div>
          <p className="text-xs text-white/60 mb-2 uppercase tracking-wider">Genre</p>
          <FilterChips
            items={["All", ...genres]}
            selected={selectedGenre}
            onSelect={setSelectedGenre}
          />
        </div>

        {/* Language Filter */}
        <div>
          <p className="text-xs text-white/60 mb-2 uppercase tracking-wider">Language</p>
          <FilterChips
            items={["All", ...languages]}
            selected={selectedLanguage}
            onSelect={setSelectedLanguage}
          />
        </div>

        {/* Sort */}
        <div>
          <p className="text-xs text-white/60 mb-2 uppercase tracking-wider">Sort By</p>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="release_date">Latest Release</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="p-4">
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMovies.map((movie, idx) => (
              <div
                key={movie.id}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <MovieCard
                  movie={movie}
                  variant="poster"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Movies Found</h3>
            <p className="text-white/60 max-w-md mb-4">
              We couldn't find any movies matching your criteria. Try adjusting your filters.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

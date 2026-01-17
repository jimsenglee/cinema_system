import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, MapPin, X, ChevronDown, ChevronRight, Star, Clock, 
  TrendingUp, Calendar, Film, SlidersHorizontal, ArrowUpDown,
  ChevronLeft, ChevronUp, Loader2, Check, RotateCcw, Grid3X3, 
  LayoutList, Heart, Play
} from "lucide-react";
import { movies, genres, languages, type Movie } from "@/data/mockData";
import { useBooking } from "@/context/BookingContext";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

// ============================================================================
// SKELETON LOADING COMPONENTS
// ============================================================================
const SkeletonCard = () => (
  <div className="w-36 flex-shrink-0">
    <div className="aspect-[2/3] rounded-xl skeleton mb-2" />
    <div className="h-4 w-3/4 rounded skeleton mb-1" />
    <div className="h-3 w-1/2 rounded skeleton" />
  </div>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-3 gap-3 px-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
        <div className="aspect-[2/3] rounded-xl skeleton mb-1.5" />
        <div className="h-3 w-3/4 rounded skeleton" />
      </div>
    ))}
  </div>
);

// ============================================================================
// SMART SEARCH WITH DEBOUNCE & RECENT SEARCHES
// ============================================================================
const SmartSearch = ({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (movieId: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsSearching(true);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setIsSearching(false), 300);
  };

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(q) ||
      movie.genre.some(g => g.toLowerCase().includes(q)) ||
      movie.cast.some(c => c.toLowerCase().includes(q)) ||
      movie.director.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const handleSelect = (movie: Movie) => {
    saveRecentSearch(movie.title);
    onSelect(movie.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background animate-blur-in">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-3 px-4 py-3">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search movies, actors, directors..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-all active:scale-90"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: "calc(100vh - 70px)" }}>
        {isSearching && query.length >= 2 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin-smooth" />
          </div>
        ) : query.length >= 2 ? (
          results.length > 0 ? (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3">{results.length} results found</p>
              <div className="space-y-2">
                {results.map((movie, idx) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelect(movie)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all active:scale-[0.98] animate-fade-in-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <img src={movie.posterUrl} alt="" className="w-12 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-foreground truncate">{movie.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-accent">
                          <Star className="w-3 h-3 fill-current" />
                          {movie.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">{movie.genre[0]}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{movie.duration}m</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <p className="text-foreground font-medium">No results for "{query}"</p>
              <p className="text-sm text-muted-foreground mt-1">Try different keywords</p>
            </div>
          )
        ) : (
          <div className="p-4">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Recent</p>
                  <button 
                    onClick={clearRecentSearches}
                    className="text-xs text-primary flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-full bg-secondary/50 text-sm text-foreground hover:bg-secondary transition-all active:scale-95"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Filters */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Browse by Genre</p>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 6).map(genre => (
                  <button
                    key={genre}
                    onClick={() => setQuery(genre)}
                    className="px-3 py-1.5 rounded-full border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all active:scale-95"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Rated */}
            <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Top Rated</p>
              <div className="space-y-2">
                {movies.sort((a, b) => b.rating - a.rating).slice(0, 4).map((movie, idx) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelect(movie)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-all active:scale-[0.98] text-left"
                  >
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 text-foreground text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <img src={movie.posterUrl} alt="" className="w-10 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{movie.title}</p>
                      <p className="text-xs text-muted-foreground">{movie.genre[0]} • {movie.duration}m</p>
                    </div>
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-sm font-semibold">{movie.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// FILTER & SORT BOTTOM SHEET
// ============================================================================
type SortOption = "rating" | "title" | "duration" | "release";
type ViewMode = "grid" | "list";

interface FilterState {
  genres: string[];
  languages: string[];
  status: "all" | "now_showing" | "coming_soon";
  minRating: number;
}

const FilterSheet = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  resultCount
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultCount: number;
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const activeFilterCount = localFilters.genres.length + localFilters.languages.length + 
    (localFilters.status !== "all" ? 1 : 0) + (localFilters.minRating > 0 ? 1 : 0);

  useEffect(() => {
    if (isOpen) setLocalFilters(filters);
  }, [isOpen, filters]);

  const toggleGenre = (genre: string) => {
    setLocalFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre) 
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const toggleLanguage = (lang: string) => {
    setLocalFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const clearAll = () => {
    setLocalFilters({ genres: [], languages: [], status: "all", minRating: 0 });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-background border-t border-border/30 rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Filter & Sort</h3>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button 
              onClick={clearAll}
              className="text-sm text-primary font-medium active:scale-95 transition-transform"
            >
              Clear All
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* View Mode */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">View</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-95",
                    viewMode === "grid" 
                      ? "bg-primary text-white" 
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-95",
                    viewMode === "list" 
                      ? "bg-primary text-white" 
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <LayoutList className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sort By</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: "rating", label: "Rating", icon: Star },
                  { value: "title", label: "Title", icon: Film },
                  { value: "duration", label: "Duration", icon: Clock },
                  { value: "release", label: "Release", icon: Calendar },
                ] as const).map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => onSortChange(value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all active:scale-95",
                      sortBy === value 
                        ? "bg-primary/20 text-primary border border-primary/30" 
                        : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                    {sortBy === value && <Check className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </div>
              
              {/* Sort Order Toggle */}
              <button
                onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
                className="mt-2 w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-secondary/30 text-muted-foreground hover:bg-secondary/50 transition-all active:scale-[0.98]"
              >
                <span className="text-sm">Order</span>
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {sortOrder === "desc" ? "High to Low" : "Low to High"}
                  <ArrowUpDown className="w-4 h-4" />
                </span>
              </button>
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Status</p>
              <div className="flex gap-2">
                {([
                  { value: "all", label: "All" },
                  { value: "now_showing", label: "Now Showing" },
                  { value: "coming_soon", label: "Coming Soon" },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setLocalFilters(prev => ({ ...prev, status: value }))}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-sm font-medium transition-all active:scale-95",
                      localFilters.status === value 
                        ? "bg-primary text-white" 
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Min Rating</p>
                <span className="text-sm font-medium text-foreground">
                  {localFilters.minRating > 0 ? `${localFilters.minRating}+` : "Any"}
                </span>
              </div>
              <div className="flex gap-2">
                {[0, 6, 7, 8, 9].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setLocalFilters(prev => ({ ...prev, minRating: rating }))}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-sm transition-all active:scale-95",
                      localFilters.minRating === rating
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {rating === 0 ? "All" : (
                      <>
                        <Star className="w-3 h-3 fill-current" />
                        {rating}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Genres</p>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 chip-select",
                      localFilters.genres.includes(genre)
                        ? "bg-primary text-white"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Language</p>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 chip-select",
                      localFilters.languages.includes(lang)
                        ? "bg-primary text-white"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/30 bg-background">
            <button
              onClick={applyFilters}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Show {resultCount} Movies
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// HERO CAROUSEL WITH GESTURE SUPPORT
// ============================================================================
const HeroCarousel = ({ 
  movies, 
  onMovieClick 
}: { 
  movies: Movie[]; 
  onMovieClick: (id: string) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const movie = movies[activeIndex] || movies[0];

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % movies.length);
    }, 4000);
    return () => clearInterval(autoPlayRef.current);
  }, [movies.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
    clearInterval(autoPlayRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveIndex(prev => (prev + 1) % movies.length);
      } else {
        setActiveIndex(prev => (prev - 1 + movies.length) % movies.length);
      }
    }
    setIsDragging(false);
  };

  if (!movie) return null;

  return (
    <div 
      className="relative h-[280px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop with parallax effect */}
      <div className="absolute inset-0 transition-transform duration-700">
        <img
          key={movie.id}
          src={movie.backdropUrl || movie.posterUrl}
          alt=""
          className="w-full h-full object-cover scale-105 animate-blur-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 pb-5">
        <div className="flex gap-3">
          <div 
            className="relative flex-shrink-0 cursor-pointer group"
            onClick={() => onMovieClick(movie.id)}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-24 h-36 rounded-xl object-cover shadow-xl ring-2 ring-white/10 group-active:scale-95 transition-transform"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-5 h-5 text-background ml-0.5" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1 text-accent text-sm font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {movie.rating}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80 text-xs">
                {movie.ageRating}
              </span>
            </div>

            <h2 
              className="font-semibold text-lg text-white leading-tight mb-1 cursor-pointer line-clamp-2"
              onClick={() => onMovieClick(movie.id)}
            >
              {movie.title}
            </h2>

            <p className="text-sm text-white/60 mb-3">
              {movie.genre.slice(0, 2).join(" • ")} • {movie.duration}m
            </p>

            <button 
              onClick={() => onMovieClick(movie.id)}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium transition-all hover:bg-primary/90 active:scale-95"
            >
              Get Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="relative h-1 rounded-full overflow-hidden bg-white/20"
            style={{ width: i === activeIndex ? 24 : 8 }}
          >
            {i === activeIndex && (
              <div 
                className="absolute inset-0 bg-white rounded-full"
                style={{
                  animation: "progress 4s linear forwards"
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Swipe Hint */}
      <div className="absolute bottom-2 right-4 flex items-center gap-1 text-white/40 text-xs">
        <ChevronLeft className="w-3 h-3 animate-drag-hint" />
        <span>Swipe</span>
        <ChevronRight className="w-3 h-3 animate-drag-hint" />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// MOVIE CARD COMPONENTS
// ============================================================================
const MovieCardGrid = ({ 
  movie, 
  onClick,
  index 
}: { 
  movie: Movie; 
  onClick: () => void;
  index: number;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      className="cursor-pointer group animate-fade-in-up card-lift"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-1.5">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Rating */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
          <Star className="w-2.5 h-2.5 text-accent fill-accent" />
          <span className="text-[10px] font-bold text-white">{movie.rating}</span>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/50 backdrop-blur-sm transition-all active:scale-90 hover:bg-black/70"
        >
          <Heart className={cn("w-3.5 h-3.5 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
        </button>

        {/* Status Badge */}
        {movie.status === "coming_soon" && (
          <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-1 rounded-md bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-sm text-center">
            <span className="text-[10px] font-bold text-white">COMING SOON</span>
          </div>
        )}
      </div>
      <h3 className="font-medium text-xs text-foreground line-clamp-1">{movie.title}</h3>
      <p className="text-[10px] text-muted-foreground">{movie.genre[0]}</p>
    </div>
  );
};

const MovieCardList = ({ 
  movie, 
  onClick,
  index 
}: { 
  movie: Movie; 
  onClick: () => void;
  index: number;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 cursor-pointer transition-all hover:bg-secondary/40 active:scale-[0.99] animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-16 h-24 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-xs text-accent">
            <Star className="w-3 h-3 fill-current" />
            {movie.rating}
          </span>
          <span className="text-xs text-muted-foreground">{movie.duration}m</span>
          <span className="px-1.5 py-0.5 rounded bg-secondary text-[10px] text-muted-foreground">
            {movie.ageRating}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{movie.genre.join(", ")}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{movie.language}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="p-2 rounded-full bg-secondary/50 transition-all active:scale-90"
        >
          <Heart className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
        </button>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  );
};

// ============================================================================
// QUICK DATE SELECTOR
// ============================================================================
const QuickDateSelector = ({ 
  selected, 
  onSelect 
}: { 
  selected: Date; 
  onSelect: (date: Date) => void;
}) => {
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="px-4 py-3 border-b border-border/30">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1">
        {dates.map((date, i) => {
          const isSelected = format(date, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd");
          const isToday = i === 0;
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={cn(
                "flex flex-col items-center min-w-[52px] px-3 py-2 rounded-xl transition-all active:scale-95",
                isSelected
                  ? "bg-primary text-white"
                  : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <span className="text-[10px] font-medium uppercase">
                {isToday ? "Today" : format(date, "EEE")}
              </span>
              <span className="text-lg font-bold tabular-nums">{format(date, "d")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SCROLL TO TOP BUTTON
// ============================================================================
const ScrollToTopButton = ({ show }: { show: boolean }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-20 right-4 z-30 w-10 h-10 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-all",
        show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

// ============================================================================
// MAIN HOMEPAGE
// ============================================================================
const HomePage = () => {
  const navigate = useNavigate();
  const { setMovie } = useBooking();
  
  // UI State
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Filter & Sort State
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    languages: [],
    status: "all",
    minRating: 0
  });
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Pagination State
  const [displayCount, setDisplayCount] = useState(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    // Apply filters
    if (filters.status !== "all") {
      result = result.filter(m => m.status === filters.status);
    }
    if (filters.genres.length > 0) {
      result = result.filter(m => filters.genres.some(g => m.genre.includes(g)));
    }
    if (filters.languages.length > 0) {
      result = result.filter(m => filters.languages.includes(m.language));
    }
    if (filters.minRating > 0) {
      result = result.filter(m => m.rating >= filters.minRating);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "duration":
          comparison = a.duration - b.duration;
          break;
        case "release":
          comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return result;
  }, [filters, sortBy, sortOrder]);

  const displayedMovies = filteredAndSortedMovies.slice(0, displayCount);
  const hasMore = displayCount < filteredAndSortedMovies.length;
  const featuredMovies = movies.filter(m => m.status === "now_showing" && m.rating >= 8.0).slice(0, 5);

  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 500);
  }, []);

  const handleMovieClick = (movieId: string) => {
    setShowSearch(false);
    navigate(`/movie/${movieId}`);
  };

  const activeFilterCount = filters.genres.length + filters.languages.length + 
    (filters.status !== "all" ? 1 : 0) + (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Smart Search */}
      <SmartSearch 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
        onSelect={handleMovieClick}
      />

      {/* Filter Sheet */}
      <FilterSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={filteredAndSortedMovies.length}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground tracking-wide">
              GALAXY
            </h1>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="w-3 h-3 text-primary" />
              <span>KLCC</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-95"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowFilters(true)}
              className="relative p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      {!isLoading && featuredMovies.length > 0 && (
        <HeroCarousel 
          movies={featuredMovies}
          onMovieClick={handleMovieClick}
        />
      )}

      {/* Quick Date Selector */}
      <QuickDateSelector selected={selectedDate} onSelect={setSelectedDate} />

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto hide-scrollbar border-b border-border/20">
          {filters.status !== "all" && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs whitespace-nowrap">
              {filters.status === "now_showing" ? "Now Showing" : "Coming Soon"}
              <button onClick={() => setFilters(prev => ({ ...prev, status: "all" }))} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.minRating > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs whitespace-nowrap">
              <Star className="w-3 h-3 fill-current" />
              {filters.minRating}+
              <button onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.genres.map(genre => (
            <span key={genre} className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-foreground text-xs whitespace-nowrap">
              {genre}
              <button onClick={() => setFilters(prev => ({ ...prev, genres: prev.genres.filter(g => g !== genre) }))} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Movies</span>
          <span className="text-sm text-muted-foreground">({filteredAndSortedMovies.length})</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>
            {sortBy === "rating" && "Top Rated"}
            {sortBy === "title" && "A-Z"}
            {sortBy === "duration" && "By Duration"}
            {sortBy === "release" && "By Release"}
          </span>
        </div>
      </div>

      {/* Movies Grid/List */}
      {isLoading ? (
        <SkeletonGrid />
      ) : filteredAndSortedMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Film className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-foreground font-medium">No movies found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
          <button
            onClick={() => setFilters({ genres: [], languages: [], status: "all", minRating: 0 })}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium transition-all active:scale-95"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-3 gap-3 px-4">
          {displayedMovies.map((movie, idx) => (
            <MovieCardGrid 
              key={movie.id} 
              movie={movie} 
              onClick={() => handleMovieClick(movie.id)}
              index={idx}
            />
          ))}
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {displayedMovies.map((movie, idx) => (
            <MovieCardList 
              key={movie.id} 
              movie={movie} 
              onClick={() => handleMovieClick(movie.id)}
              index={idx}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium transition-all hover:bg-secondary/80 active:scale-95 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin-smooth" />
                Loading...
              </>
            ) : (
              <>
                Load More
                <span className="text-muted-foreground">
                  ({filteredAndSortedMovies.length - displayCount} more)
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {!isLoading && filteredAndSortedMovies.length > 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          Showing {displayedMovies.length} of {filteredAndSortedMovies.length}
        </div>
      )}

      {/* Scroll to Top */}
      <ScrollToTopButton show={showScrollTop} />
    </div>
  );
};

export default HomePage;

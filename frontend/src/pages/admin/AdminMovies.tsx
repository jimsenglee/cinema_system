import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Film, Clock, Star, X, Info, Filter } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { movies, Movie } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const statusColors = {
  now_showing: "bg-success/20 text-success border-success/30",
  coming_soon: "bg-primary/20 text-primary border-primary/30",
  ended: "bg-muted text-muted-foreground border-border/30"
};

const AdminMovies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<Movie["status"] | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    rating: "",
    genre: "",
    language: "",
    releaseDate: "",
    synopsis: "",
    director: "",
    cast: "",
    ageRating: "PG",
    status: "coming_soon" as Movie["status"],
    posterUrl: "",
    backdropUrl: ""
  });

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || movie.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddMovie = () => {
    setFormData({
      title: "",
      duration: "",
      rating: "",
      genre: "",
      language: "",
      releaseDate: "",
      synopsis: "",
      director: "",
      cast: "",
      ageRating: "PG",
      status: "coming_soon",
      posterUrl: "",
      backdropUrl: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      duration: movie.duration.toString(),
      rating: movie.rating.toString(),
      genre: movie.genre.join(", "),
      language: movie.language,
      releaseDate: movie.releaseDate,
      synopsis: movie.synopsis,
      director: movie.director,
      cast: movie.cast.join(", "),
      ageRating: movie.ageRating,
      status: movie.status,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Movie "${formData.title}" added successfully!`);
    setIsAddDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Movie "${formData.title}" updated successfully!`);
    setIsEditDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Movie "${selectedMovie?.title}" deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setIsSubmitting(false);
  };

  return (
    <AdminLayout title="Movies" subtitle="Manage your movie catalog">
      {/* Actions Bar */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies by title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-card/50 border border-border/50 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="cinema" className="gap-2 w-full sm:w-auto" onClick={handleAddMovie}>
                <Plus className="w-4 h-4" />
                <span>Add Movie</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new movie to your catalog</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Filters Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {(["all", "now_showing", "coming_soon", "ended"] as const).map((status) => (
            <Tooltip key={status} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                    filterStatus === status
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-card/50 text-muted-foreground border border-border/30 hover:text-foreground"
                  )}
                >
                  {status === "all" ? "All" : status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{status === "all" ? "Show all movies" : `Filter by ${status.replace("_", " ")} status`}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        {/* Results Info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <span>Showing {filteredMovies.length} of {movies.length} movies</span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filteredMovies.map((movie) => (
          <GlassCard key={movie.id} className="overflow-hidden p-0 group">
            <div className="relative aspect-[2/3]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              {/* Status Badge */}
              <span className={cn(
                "absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium border",
                statusColors[movie.status]
              )}>
                {movie.status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>

              {/* Actions - Always visible */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1.5 sm:gap-2">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => handleEditMovie(movie)}
                      className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                      aria-label="Edit movie"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Edit "{movie.title}"</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => handleDeleteMovie(movie)}
                      className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-background/90 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                      aria-label="Delete movie"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Delete "{movie.title}"</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
                <h3 className="font-semibold text-foreground mb-0.5 sm:mb-1 line-clamp-1 text-sm sm:text-base">{movie.title}</h3>
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5 sm:gap-1">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
                    {movie.rating}
                  </span>
                  <span className="flex items-center gap-0.5 sm:gap-1">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {movie.duration}m
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                  {movie.genre.slice(0, 2).map((g) => (
                    <span key={g} className="px-1.5 sm:px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] sm:text-xs border border-primary/20">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <Film className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-medium text-foreground">No movies found</p>
          <p className="text-xs sm:text-sm text-muted-foreground text-center px-4">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setFilterStatus("all"); }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Add Movie Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" />
              Add New Movie
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new movie to the catalog. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter movie title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g. 120"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (0-10) *</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  placeholder="e.g. 8.5"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="language">Language *</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  placeholder="e.g. English"
                  required
                />
              </div>
              <div>
                <Label htmlFor="releaseDate">Release Date *</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="ageRating">Age Rating *</Label>
                <Select value={formData.ageRating} onValueChange={(value) => setFormData({...formData, ageRating: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="G">G - General Audiences</SelectItem>
                    <SelectItem value="PG">PG - Parental Guidance</SelectItem>
                    <SelectItem value="PG-13">PG-13 - Parents Cautioned</SelectItem>
                    <SelectItem value="R">R - Restricted</SelectItem>
                    <SelectItem value="NC-17">NC-17 - Adults Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                    <SelectItem value="now_showing">Now Showing</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="genre">Genres (comma-separated) *</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                placeholder="e.g. Action, Thriller, Sci-Fi"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Separate multiple genres with commas</p>
            </div>
            <div>
              <Label htmlFor="director">Director *</Label>
              <Input
                id="director"
                value={formData.director}
                onChange={(e) => setFormData({...formData, director: e.target.value})}
                placeholder="Enter director name"
                required
              />
            </div>
            <div>
              <Label htmlFor="cast">Cast (comma-separated) *</Label>
              <Input
                id="cast"
                value={formData.cast}
                onChange={(e) => setFormData({...formData, cast: e.target.value})}
                placeholder="e.g. Actor One, Actor Two, Actor Three"
                required
              />
            </div>
            <div>
              <Label htmlFor="synopsis">Synopsis *</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => setFormData({...formData, synopsis: e.target.value})}
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="posterUrl">Poster URL *</Label>
              <Input
                id="posterUrl"
                type="url"
                value={formData.posterUrl}
                onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <Label htmlFor="backdropUrl">Backdrop URL *</Label>
              <Input
                id="backdropUrl"
                type="url"
                value={formData.backdropUrl}
                onChange={(e) => setFormData({...formData, backdropUrl: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="cinema" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Movie"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription>
              Update the movie details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-duration">Duration (minutes) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-rating">Rating (0-10) *</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-language">Language *</Label>
                <Input
                  id="edit-language"
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-ageRating">Age Rating *</Label>
                <Select value={formData.ageRating} onValueChange={(value) => setFormData({...formData, ageRating: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="G">G - General Audiences</SelectItem>
                    <SelectItem value="PG">PG - Parental Guidance</SelectItem>
                    <SelectItem value="PG-13">PG-13 - Parents Cautioned</SelectItem>
                    <SelectItem value="R">R - Restricted</SelectItem>
                    <SelectItem value="NC-17">NC-17 - Adults Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                    <SelectItem value="now_showing">Now Showing</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-releaseDate">Release Date *</Label>
              <Input
                id="edit-releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-genre">Genres (comma-separated) *</Label>
              <Input
                id="edit-genre"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                placeholder="e.g. Action, Thriller, Sci-Fi"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-director">Director *</Label>
              <Input
                id="edit-director"
                value={formData.director}
                onChange={(e) => setFormData({...formData, director: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-cast">Cast (comma-separated) *</Label>
              <Input
                id="edit-cast"
                value={formData.cast}
                onChange={(e) => setFormData({...formData, cast: e.target.value})}
                placeholder="e.g. Actor One, Actor Two, Actor Three"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-synopsis">Synopsis *</Label>
              <Textarea
                id="edit-synopsis"
                value={formData.synopsis}
                onChange={(e) => setFormData({...formData, synopsis: e.target.value})}
                rows={4}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="cinema" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Movie"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Movie?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedMovie?.title}"? This action cannot be undone and will remove all associated showtimes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete Movie"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminMovies;

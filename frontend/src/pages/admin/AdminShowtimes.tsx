import { useState } from "react";
import { Plus, Calendar, Clock, MapPin, Film, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { showtimes, movies, cinemas } from "@/data/mockData";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AdminShowtimes = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    movieId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    hallName: "",
    hallType: "Standard",
    price: "42"
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredShowtimes = showtimes.filter(
    s => s.date === format(selectedDate, "yyyy-MM-dd")
  );

  const getMovieById = (id: string) => movies.find(m => m.id === id);

  // Group by hall
  const groupedShowtimes = filteredShowtimes.reduce((acc, st) => {
    const key = st.hallName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(st);
    return acc;
  }, {} as Record<string, typeof showtimes>);

  const handleAddShowtime = () => {
    setFormData({
      movieId: "",
      date: format(selectedDate, "yyyy-MM-dd"),
      time: "",
      hallName: "",
      hallType: "Standard",
      price: "42"
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteShowtime = (showtime: any) => {
    setSelectedShowtime(showtime);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const movie = getMovieById(formData.movieId);
    toast.success(`Showtime for "${movie?.title}" added successfully!`);
    setIsAddDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Showtime deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setIsSubmitting(false);
  };

  return (
    <AdminLayout title="Showtimes" subtitle="Schedule and manage movie showtimes">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="cinema" className="gap-2 sm:ml-auto text-xs sm:text-sm" onClick={handleAddShowtime}>
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add Showtime</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Schedule a new showtime for {format(selectedDate, "MMM d")}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4 gap-1 sm:gap-2">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-secondary/50 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Previous week</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar flex-1 min-w-0">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all min-w-[48px] sm:min-w-[60px] flex-shrink-0",
                  isSelected
                    ? "bg-primary/20 text-primary border border-primary/30 neon-border-purple"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <span className="text-[10px] sm:text-xs font-medium">{format(day, "EEE")}</span>
                <span className="text-sm sm:text-lg font-bold">{format(day, "d")}</span>
                {isToday && <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-accent mt-0.5 sm:mt-1" />}
              </button>
            );
          })}
        </div>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-secondary/50 transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Next week</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Showtimes by Hall */}
      <div className="space-y-4 sm:space-y-6">
        {Object.keys(groupedShowtimes).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg font-medium text-foreground">No showtimes for this date</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Add a showtime to get started</p>
          </div>
        ) : (
          Object.entries(groupedShowtimes).map(([hallName, hallShowtimes]) => (
            <GlassCard key={hallName} className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary animate-pulse" />
                <h3 className="font-semibold text-sm sm:text-base text-foreground">{hallName}</h3>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  ({hallShowtimes[0].hallType})
                </span>
              </div>
              
              <div className="grid gap-2 sm:gap-3">
                {hallShowtimes.sort((a, b) => a.time.localeCompare(b.time)).map((st) => {
                  const movie = getMovieById(st.movieId);
                  
                  return (
                    <div 
                      key={st.id}
                      className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      {movie && (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-12 h-18 sm:w-16 sm:h-24 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base text-foreground truncate">{movie?.title}</h4>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            {st.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Film className="w-3 h-3 sm:w-4 sm:h-4" />
                            {movie?.duration}m
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] sm:text-sm text-muted-foreground">From</p>
                        <p className="font-semibold text-sm sm:text-base text-accent">RM {st.price}</p>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1.5 sm:p-2 h-auto" onClick={() => handleDeleteShowtime(st)}>
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Delete {st.time} showtime</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Add Showtime Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Showtime</DialogTitle>
            <DialogDescription>
              Schedule a new movie showtime
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div>
              <Label htmlFor="movieId">Movie *</Label>
              <Select value={formData.movieId} onValueChange={(value) => setFormData({...formData, movieId: value})} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.filter(m => m.status === "now_showing" || m.status === "coming_soon").map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hallName">Hall *</Label>
                <Select value={formData.hallName} onValueChange={(value) => setFormData({...formData, hallName: value})} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hall" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hall 1">Hall 1</SelectItem>
                    <SelectItem value="Hall 2">Hall 2</SelectItem>
                    <SelectItem value="Hall 3">Hall 3</SelectItem>
                    <SelectItem value="Hall 4">Hall 4</SelectItem>
                    <SelectItem value="Hall 5">Hall 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hallType">Hall Type *</Label>
                <Select value={formData.hallType} onValueChange={(value) => setFormData({...formData, hallType: value})} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="IMAX">IMAX</SelectItem>
                    <SelectItem value="Dolby">Dolby Atmos</SelectItem>
                    <SelectItem value="4DX">4DX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="price">Price (RM) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="cinema" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Showtime"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Showtime?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this showtime? This action cannot be undone and will affect any existing bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete Showtime"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminShowtimes;

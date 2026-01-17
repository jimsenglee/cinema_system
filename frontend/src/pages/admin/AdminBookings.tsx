import { useState } from "react";
import { Search, Filter, Download, Eye, MoreHorizontal, Ticket, X, ChevronRight } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { bookingHistory, Booking } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const statusColors: Record<Booking["status"], string> = {
  confirmed: "bg-success/20 text-success border-success/30",
  completed: "bg-muted text-muted-foreground border-border/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30"
};

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<Booking["status"] | "all">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const filteredBookings = bookingHistory.filter(booking => {
    const matchesSearch = 
      booking.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.movieTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailDialogOpen(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(`Exported ${filteredBookings.length} bookings successfully!`);
    setIsExporting(false);
  };

  return (
    <AdminLayout title="Bookings" subtitle="View and manage customer bookings">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <GlassCard className="text-center p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-foreground">{filteredBookings.length}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Total Bookings</p>
        </GlassCard>
        <GlassCard className="text-center p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-accent">RM {totalRevenue.toLocaleString()}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Revenue</p>
        </GlassCard>
        <GlassCard className="text-center p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-success">{filteredBookings.filter(b => b.status === "confirmed").length}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Confirmed</p>
        </GlassCard>
        <GlassCard className="text-center p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-muted-foreground">{filteredBookings.filter(b => b.status === "completed").length}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
        </GlassCard>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-3 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by reference or movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-card/50 border border-border/50 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="gap-2 text-xs sm:text-sm" onClick={handleExport} disabled={isExporting}>
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export"}</span>
                <span className="sm:hidden">{isExporting ? "..." : "CSV"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Export bookings data to CSV</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {(["all", "confirmed", "completed", "cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                filterStatus === status
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-card/50 text-muted-foreground border border-border/30 hover:text-foreground"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {filteredBookings.map((booking) => (
          <GlassCard key={booking.id} className="p-3">
            <div className="flex gap-3">
              <img 
                src={booking.posterUrl} 
                alt={booking.movieTitle}
                className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{booking.movieTitle}</p>
                    <p className="text-xs text-muted-foreground">{booking.hall}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[10px] font-medium border flex-shrink-0",
                    statusColors[booking.status]
                  )}>
                    {booking.status}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono">{booking.referenceCode}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(booking.date), "MMM d")} • {booking.time}
                  </p>
                  <p className="text-xs text-primary">Seats: {booking.seats.join(", ")}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-sm text-accent">RM {booking.totalAmount}</span>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleViewDetails(booking)}
                        className="p-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>View booking details</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
        
        {filteredBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Ticket className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-foreground">No bookings found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <GlassCard className="overflow-x-auto hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reference</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Movie</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Seats</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-mono text-sm text-foreground">{booking.referenceCode}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={booking.posterUrl} 
                      alt={booking.movieTitle}
                      className="w-10 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{booking.movieTitle}</p>
                      <p className="text-xs text-muted-foreground">{booking.hall}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-foreground">{format(new Date(booking.date), "MMM d, yyyy")}</p>
                  <p className="text-xs text-muted-foreground">{booking.time}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-primary">{booking.seats.join(", ")}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-accent">RM {booking.totalAmount}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium border",
                    statusColors[booking.status]
                  )}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => handleViewDetails(booking)}
                          className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p>View booking details for {booking.referenceCode}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Ticket className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-foreground">No bookings found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </GlassCard>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reference Code</p>
                  <p className="text-lg font-bold text-foreground">{selectedBooking.referenceCode}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-lg text-sm font-medium border",
                  statusColors[selectedBooking.status]
                )}>
                  {selectedBooking.status}
                </span>
              </div>

              <Separator />

              <div className="flex gap-4">
                <img
                  src={selectedBooking.posterUrl}
                  alt={selectedBooking.movieTitle}
                  className="w-24 h-36 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-xl text-foreground">{selectedBooking.movieTitle}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="text-foreground font-medium">Date:</span> {format(new Date(selectedBooking.date), "MMMM d, yyyy")}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-foreground font-medium">Time:</span> {selectedBooking.time}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-foreground font-medium">Hall:</span> {selectedBooking.hall}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-foreground font-medium">Seats:</span> {selectedBooking.seats.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tickets ({selectedBooking.seats.length}x)</span>
                    <span className="text-foreground">RM {selectedBooking.ticketTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Concessions</span>
                    <span className="text-foreground">RM {selectedBooking.concessionTotal.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-accent text-lg">RM {selectedBooking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Payment Method: {selectedBooking.paymentMethod}
                </p>
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground">
                <p>Booked on: {format(new Date(selectedBooking.createdAt), "PPpp")}</p>
                <p>User ID: {selectedBooking.userId}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBookings;

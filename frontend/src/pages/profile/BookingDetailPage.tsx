import { PageContainer } from "@/components/layouts/PageContainer";
import { Calendar, Download, MapPin, Clock, Ticket, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

// Mock booking detail
const mockBookingDetail = {
  id: "BK001",
  movieTitle: "Dune: Part Two",
  posterUrl: "/placeholder.svg",
  date: "2026-01-20",
  time: "19:30",
  cinema: "CineverseHub Central",
  address: "Level 3, The Mall, Central District",
  hall: "Hall 1 - IMAX",
  seats: ["A5", "A6"],
  status: "confirmed",
  reference: "CH-2026-001",
  bookingDate: "2026-01-16",
  tickets: [
    { seatLabel: "A5", type: "Adult", price: 22.50, qrCode: "QR-001-A5" },
    { seatLabel: "A6", type: "Adult", price: 22.50, qrCode: "QR-001-A6" }
  ],
  concessions: [
    { name: "Large Popcorn", quantity: 2, price: 15.00 },
    { name: "Medium Coke", quantity: 2, price: 10.00 }
  ],
  subtotal: 45.00,
  concessionTotal: 25.00,
  tax: 3.50,
  total: 73.50,
  paymentMethod: "Credit Card ****1234"
};

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In real app, fetch booking by ID
  const booking = mockBookingDetail;

  return (
    <PageContainer title="Booking Details">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2 text-sm">
            ✓ Booking Confirmed
          </Badge>
        </div>

        {/* Movie Info */}
        <div className="flex gap-4 p-4 rounded-2xl bg-card/50 border border-border/50">
          <div className="w-24 h-36 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
            <img 
              src={booking.posterUrl} 
              alt={booking.movieTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground mb-3">
              {booking.movieTitle}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                {format(new Date(booking.date), "EEEE, d MMMM yyyy")}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                {booking.time}
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p>{booking.cinema}</p>
                  <p className="text-xs">{booking.address}</p>
                  <p className="text-xs font-semibold mt-1">{booking.hall}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Reference */}
        <div className="p-4 rounded-xl bg-secondary/30 text-center">
          <p className="text-xs text-muted-foreground mb-1">Booking Reference</p>
          <p className="font-mono text-lg font-bold text-foreground tracking-wider">
            {booking.reference}
          </p>
        </div>

        {/* Tickets */}
        <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            Tickets
          </h3>
          {booking.tickets.map((ticket, index) => (
            <div key={index} className="p-3 rounded-xl bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">Seat {ticket.seatLabel}</p>
                  <p className="text-xs text-muted-foreground">{ticket.type}</p>
                </div>
                <p className="font-semibold text-foreground">{formatPrice(ticket.price)}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <QrCode className="w-3 h-3" />
                <span className="font-mono">{ticket.qrCode}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Concessions */}
        {booking.concessions && booking.concessions.length > 0 && (
          <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-3">
            <h3 className="font-semibold text-foreground">Add-ons</h3>
            {booking.concessions.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-foreground">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Payment Summary */}
        <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-2">
          <h3 className="font-semibold text-foreground mb-3">Payment Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tickets</span>
            <span className="text-foreground">{formatPrice(booking.subtotal)}</span>
          </div>
          {booking.concessionTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Add-ons</span>
              <span className="text-foreground">{formatPrice(booking.concessionTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">{formatPrice(booking.tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatPrice(booking.total)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Paid via {booking.paymentMethod}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            variant="cinema" 
            className="w-full"
            onClick={() => navigate('/profile/qr-ticket')}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Show QR Code
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>

        {/* Booking Info */}
        <div className="p-3 rounded-xl bg-secondary/20 text-xs text-muted-foreground text-center">
          Booked on {format(new Date(booking.bookingDate), "d MMM yyyy 'at' HH:mm")}
        </div>
      </div>
    </PageContainer>
  );
};

export default BookingDetailPage;

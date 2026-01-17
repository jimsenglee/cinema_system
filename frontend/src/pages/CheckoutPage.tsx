import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CreditCard, Wallet, Check, AlertCircle, Shield, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/BookingContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatPrice, formatCountdownTime } from "@/lib/formatters";

const LOCK_DURATION = 5 * 60; // 5 minutes in seconds

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    movie, 
    showtime, 
    selectedSeats, 
    seatDetails,
    concessions, 
    ticketTotal, 
    concessionTotal, 
    calculateTotal,
    clearBooking 
  } = useBooking();
  
  const [timeLeft, setTimeLeft] = useState(LOCK_DURATION);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!movie || !showtime || selectedSeats.length === 0) {
      navigate("/");
    }
  }, [movie, showtime, selectedSeats, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Session expired! Your seats have been released.");
          clearBooking();
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, clearBooking]);

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Payment successful! Enjoy your movie!");
    clearBooking();
    navigate("/tickets");
  };

  const seatLabels = seatDetails.map(s => `${s.row}${s.number}`).join(", ");

  if (!movie || !showtime) return null;

  const isLowTime = timeLeft < 60;

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-foreground">
                Checkout
              </h1>
            </div>
            {/* Timer */}
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              isLowTime 
                ? "bg-destructive/20 text-destructive animate-pulse neon-glow-purple" 
                : "bg-primary/10 text-primary border border-primary/30"
            )}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Ticket Summary Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/50">
          {/* Ticket Top */}
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-4 border-b border-dashed border-border/50">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Ticket className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">E-Ticket</span>
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">{movie.title}</h3>
          </div>

          {/* Ticket Body */}
          <div className="bg-card/50 p-4">
            <div className="flex gap-4">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 rounded-xl object-cover shadow-lg border border-border/30"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Cinema:</span>
                  <span className="text-foreground font-medium">{showtime.hallName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                    {showtime.hallType}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground font-medium">
                    {format(new Date(showtime.date), "EEE, d MMM yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-foreground font-medium">{showtime.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Seats:</span>
                  <span className="text-primary font-semibold">{seatLabels}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cutout effect */}
          <div className="absolute left-0 top-[72px] w-4 h-8 bg-background rounded-r-full" />
          <div className="absolute right-0 top-[72px] w-4 h-8 bg-background rounded-l-full" />
        </div>

        {/* Order Summary */}
        <div className="p-4 rounded-2xl bg-card/50 border border-border/50 space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Order Summary
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {selectedSeats.length}x Movie Ticket{selectedSeats.length > 1 ? "s" : ""}
              </span>
              <span className="text-foreground font-medium">{formatPrice(ticketTotal)}</span>
            </div>
            
            {concessions.map(c => (
              <div key={c.item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {c.quantity}x {c.item.name}
                </span>
                <span className="text-foreground font-medium">
                  {formatPrice(c.item.price * c.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/30 flex justify-between items-center">
            <span className="font-semibold text-foreground">Total Amount</span>
            <span className="font-display text-2xl font-bold text-accent neon-text-gold">
              {formatPrice(calculateTotal())}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Select Payment Method</h4>
          
          <button
            onClick={() => setSelectedPayment("card")}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
              selectedPayment === "card"
                ? "bg-primary/10 border-primary neon-border-purple"
                : "bg-card/30 border-border/50 hover:border-primary/50"
            )}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Credit / Debit Card</p>
              <p className="text-xs text-muted-foreground">Visa, Mastercard, AMEX</p>
            </div>
            {selectedPayment === "card" && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>

          <button
            onClick={() => setSelectedPayment("tng")}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
              selectedPayment === "tng"
                ? "bg-primary/10 border-primary neon-border-purple"
                : "bg-card/30 border-border/50 hover:border-primary/50"
            )}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Touch 'n Go eWallet</p>
              <p className="text-xs text-muted-foreground">Pay with TnG balance</p>
            </div>
            {selectedPayment === "tng" && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>

          <button
            onClick={() => setSelectedPayment("grab")}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
              selectedPayment === "grab"
                ? "bg-primary/10 border-primary neon-border-purple"
                : "bg-card/30 border-border/50 hover:border-primary/50"
            )}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">GrabPay</p>
              <p className="text-xs text-muted-foreground">Pay with GrabPay wallet</p>
            </div>
            {selectedPayment === "grab" && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Secured by 256-bit SSL encryption</p>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Seats Locked</p>
            <p className="text-xs text-destructive/80 mt-0.5">
              Complete payment within {formatTime(timeLeft)} or your booking will be cancelled and seats released.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/40 p-4 pb-6">
        <Button
          variant="cinema"
          size="xl"
          className="w-full h-14 text-lg"
          onClick={handlePayment}
          disabled={!selectedPayment || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing Payment...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Pay {formatPrice(calculateTotal())}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;

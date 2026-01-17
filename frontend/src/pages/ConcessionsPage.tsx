import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Sparkles, Flame, Leaf } from "lucide-react";
import { concessionItems, ConcessionItem } from "@/data/mockData";
import { ConcessionItemCard } from "@/components/ConcessionItem";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/context/BookingContext";
import { FilterChips } from "@/components/FilterChips";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

const categories = ["All", "Combos", "Popcorn", "Drinks", "Snacks"];

const ConcessionsPage = () => {
  const navigate = useNavigate();
  const { movie, showtime, concessions, updateConcession, ticketTotal, concessionTotal, calculateTotal } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (!movie || !showtime) {
      navigate("/");
    }
  }, [movie, showtime, navigate]);

  const filteredItems = selectedCategory === "All"
    ? concessionItems
    : concessionItems.filter(item => item.category === selectedCategory);

  const getQuantity = (itemId: string) => {
    return concessions.find(c => c.item.id === itemId)?.quantity || 0;
  };

  const handleQuantityChange = (item: ConcessionItem, quantity: number) => {
    updateConcession(item, quantity);
  };

  const totalItems = concessions.reduce((sum, c) => sum + c.quantity, 0);

  if (!movie || !showtime) return null;

  return (
    <div className="min-h-screen bg-background pb-56">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
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
                Food & Drinks
              </h1>
              <p className="text-xs text-muted-foreground">Enhance your movie experience</p>
            </div>
            {totalItems > 0 && (
              <div className="relative p-2">
                <ShoppingBag className="w-6 h-6 text-foreground" />
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center px-1.5 neon-glow-purple">
                  {totalItems}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Featured Banner */}
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 p-4 border border-primary/20">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Combo Deals</p>
              <p className="text-xs text-muted-foreground">Save up to 20% with our combos</p>
            </div>
            <Flame className="w-5 h-5 text-accent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-4 border-b border-border/20">
        <FilterChips
          items={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Items List */}
      <div className="p-4 space-y-3">
        {filteredItems.map((item, idx) => (
          <div 
            key={item.id}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <ConcessionItemCard
              item={item}
              quantity={getQuantity(item.id)}
              onQuantityChange={(qty) => handleQuantityChange(item, qty)}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/40 p-4 pb-6">
        {/* Price Breakdown */}
        <div className="space-y-2 mb-4 p-3 rounded-xl bg-card/30">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Movie Tickets</span>
            <span className="text-foreground font-medium">{formatPrice(ticketTotal)}</span>
          </div>
          {concessionTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <ShoppingBag className="w-3.5 h-3.5" />
                Food & Drinks
              </span>
              <span className="text-foreground font-medium">{formatPrice(concessionTotal)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border/30">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-display text-xl font-bold text-accent neon-text-gold">
              {formatPrice(calculateTotal())}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-border/50 hover:bg-secondary/50"
            onClick={() => navigate("/checkout")}
          >
            Skip
          </Button>
          <Button
            variant="cinema"
            size="lg"
            className="flex-1"
            onClick={() => navigate("/checkout")}
          >
            {concessionTotal > 0 ? "Checkout" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConcessionsPage;

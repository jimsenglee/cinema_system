import { Minus, Plus, Flame } from "lucide-react";
import { ConcessionItem as ItemType } from "@/data/mockData";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

interface ConcessionItemProps {
  item: ItemType;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const ConcessionItemCard = ({ item, quantity, onQuantityChange }: ConcessionItemProps) => {
  const isCombo = item.category === "Combos";
  
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
      quantity > 0 
        ? "bg-primary/5 border-primary/30 neon-border-purple" 
        : "bg-card/50 border-border/50 hover:border-border"
    )}>
      <div className={cn(
        "relative w-16 h-16 rounded-xl flex items-center justify-center text-3xl",
        isCombo ? "bg-gradient-to-br from-accent/20 to-accent/5" : "bg-secondary/50"
      )}>
        {item.imageUrl}
        {isCombo && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
            <Flame className="w-3 h-3 text-accent-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-foreground">{item.name}</h4>
          {isCombo && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent uppercase">
              Save 20%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
        <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.price)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "w-9 h-9 rounded-full border-2 transition-all",
            quantity === 0 ? "opacity-50" : "border-primary/50"
          )}
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
          disabled={quantity === 0}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <span className={cn(
          "w-8 text-center font-bold transition-all",
          quantity > 0 ? "text-primary text-lg" : "text-muted-foreground"
        )}>
          {quantity}
        </span>
        
        <Button
          variant="neon"
          size="icon"
          className="w-9 h-9 rounded-full"
          onClick={() => onQuantityChange(quantity + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

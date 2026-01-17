import { cn } from "@/lib/utils";

interface FilterChipsProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
  variant?: "default" | "secondary";
}

export const FilterChips = ({ items, selected, onSelect, variant = "default" }: FilterChipsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1 px-1">
      {items.map((item) => {
        const isSelected = item === selected;
        
        return (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
              variant === "default"
                ? isSelected
                  ? "bg-primary text-primary-foreground neon-border-purple"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                : isSelected
                  ? "bg-accent text-accent-foreground neon-border-gold"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};

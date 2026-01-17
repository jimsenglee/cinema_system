import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  className?: string;
  trend?: { value: number; isPositive: boolean };
  variant?: "default" | "primary";
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  className,
  trend,
  variant = "default",
}: StatCardProps) => {
  return (
    <div className={cn(
      "flex flex-col p-4 rounded-2xl border",
      variant === "primary" 
        ? "bg-primary/10 border-primary/30" 
        : "bg-card/30 border-border/30",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={cn("w-5 h-5", iconColor)} />
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
}

export const GlassCard = ({
  children,
  className,
  variant = "default",
  padding = "md",
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variant === "default" && "bg-card/30 border border-border/30",
        variant === "elevated" && "bg-card/50 border border-border/50 shadow-lg",
        variant === "bordered" && "bg-card/20 border-2 border-primary/30 neon-border-purple",
        padding === "none" && "p-0",
        padding === "sm" && "p-3",
        padding === "md" && "p-4",
        padding === "lg" && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

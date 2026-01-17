import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-card/30 border border-border/30",
      className
    )}>
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-primary/50" />
      </div>
      <p className="text-foreground font-medium">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground text-center mt-1 max-w-[280px]">
          {description}
        </p>
      )}
      {action && (
        <Button variant="neon" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
};

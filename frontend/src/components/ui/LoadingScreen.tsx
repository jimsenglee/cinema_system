import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Reusable loading screen component following DRY principles
 * Use this for consistent loading states across the app
 */
export const LoadingScreen = ({
  text = "Loading...",
  fullScreen = false,
  className
}: LoadingScreenProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen ? "min-h-screen bg-background" : "py-12",
        className
      )}
    >
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

/**
 * Loading skeleton for content placeholders
 */
export const LoadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-secondary/50",
        className
      )}
    />
  );
};

/**
 * Loading dots animation
 */
export const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
    </div>
  );
};

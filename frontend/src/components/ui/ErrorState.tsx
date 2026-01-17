import { AlertCircle, XCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  error: Error | string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Reusable error state component following DRY principles
 * Use this for consistent error displays across the app
 */
export const ErrorState = ({
  error,
  title = "Something went wrong",
  onRetry,
  className
}: ErrorStateProps) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
      </div>
      
      <h3 className="font-display text-xl font-bold text-foreground mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        {errorMessage}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
};

/**
 * Inline error message component
 */
export const ErrorMessage = ({
  message,
  className
}: {
  message: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm",
        className
      )}
    >
      <XCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

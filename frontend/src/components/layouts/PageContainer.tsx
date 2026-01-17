import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  headerAction?: ReactNode;
  className?: string;
}

/**
 * Reusable page container following DRY principles
 * Provides consistent layout, header, and navigation
 */
export const PageContainer = ({
  children,
  title,
  showBackButton = true,
  headerAction,
  className
}: PageContainerProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 right-0 w-full h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors active:scale-95"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
          </div>
          {headerAction}
        </div>
      </header>

      {/* Content */}
      <div className={cn("p-4", className)}>
        {children}
      </div>
    </div>
  );
};

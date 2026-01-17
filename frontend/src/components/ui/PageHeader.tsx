import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: ReactNode;
  className?: string;
  onBack?: () => void;
}

export const PageHeader = ({
  title,
  subtitle,
  showBack = false,
  rightElement,
  className,
  onBack,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn("sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40", className)}>
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-bold text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          {rightElement}
        </div>
      </div>
    </header>
  );
};

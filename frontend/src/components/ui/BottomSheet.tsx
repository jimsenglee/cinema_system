import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  showHandle?: boolean;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  showHandle = true,
}: BottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div
          className={cn(
            "glass-dark border-t border-border/30 rounded-t-3xl max-h-[85vh] overflow-y-auto",
            className
          )}
        >
          {/* Handle */}
          {showHandle && (
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
            </div>
          )}

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-4 pb-4 border-b border-border/30">
              <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Content */}
          {children}
        </div>
      </div>
    </>
  );
};

import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MenuButtonProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  iconColor?: string;
  rightElement?: ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
}

export const MenuButton = ({
  icon: Icon,
  label,
  description,
  onClick,
  iconColor = "text-primary",
  rightElement,
  variant = "default",
  disabled = false,
}: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 active:scale-[0.98]",
        variant === "danger" 
          ? "hover:bg-destructive/10 text-destructive" 
          : "hover:bg-secondary/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        variant === "danger" ? "bg-destructive/10" : "bg-secondary/50"
      )}>
        <Icon className={cn("w-5 h-5", variant === "danger" ? "" : iconColor)} />
      </div>
      <div className="flex-1 text-left">
        <p className={cn(
          "font-medium",
          variant === "danger" ? "" : "text-foreground"
        )}>{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {rightElement || <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </button>
  );
};

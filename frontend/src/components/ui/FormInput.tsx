import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  rightElement?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon: Icon, rightElement, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "w-full h-14 rounded-2xl bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50",
              "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all",
              Icon ? "pl-12" : "pl-4",
              (isPassword || rightElement) ? "pr-12" : "pr-4",
              error && "border-destructive focus:border-destructive focus:ring-destructive/50",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          {rightElement && !isPassword && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

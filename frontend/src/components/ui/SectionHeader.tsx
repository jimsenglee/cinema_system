import React from "react";
import { cn } from "@/lib/utils";

/**
 * SectionHeader component props
 */
export interface SectionHeaderProps {
  /**
   * Main title text
   */
  title: string;
  
  /**
   * Optional subtitle/description
   */
  subtitle?: string;
  
  /**
   * Optional action button or element on the right
   */
  action?: React.ReactNode;
  
  /**
   * Size variant
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Title CSS classes
   */
  titleClassName?: string;
  
  /**
   * Subtitle CSS classes
   */
  subtitleClassName?: string;
}

/**
 * Reusable section header component with title, subtitle, and optional action button
 * 
 * Features:
 * - Consistent typography hierarchy
 * - Optional subtitle
 * - Right-aligned action slot
 * - Size variants
 * - Responsive design
 * 
 * @example
 * <SectionHeader 
 *   title="Popular Movies" 
 *   subtitle="Trending this week"
 *   action={<Button>View All</Button>}
 * />
 */
export function SectionHeader({
  title,
  subtitle,
  action,
  size = "default",
  className,
  titleClassName,
  subtitleClassName
}: SectionHeaderProps) {
  const sizeClasses = {
    sm: "mb-3",
    default: "mb-4",
    lg: "mb-6"
  };

  const titleSizeClasses = {
    sm: "text-lg font-semibold",
    default: "text-xl font-bold",
    lg: "text-2xl md:text-3xl font-bold"
  };

  const subtitleSizeClasses = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn(
      "flex items-start justify-between gap-4",
      sizeClasses[size],
      className
    )}>
      <div className="flex-1">
        <h2 className={cn(
          titleSizeClasses[size],
          "text-white",
          titleClassName
        )}>
          {title}
        </h2>
        
        {subtitle && (
          <p className={cn(
            subtitleSizeClasses[size],
            "text-white/60 mt-1",
            subtitleClassName
          )}>
            {subtitle}
          </p>
        )}
      </div>
      
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

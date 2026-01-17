import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * InfoCard component props
 */
export interface InfoCardProps {
  /**
   * Card title
   */
  title?: string;
  
  /**
   * Icon element
   */
  icon?: React.ReactNode;
  
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * Whether to show glass effect
   * @default false
   */
  glass?: boolean;
  
  /**
   * Whether card is clickable
   * @default false
   */
  clickable?: boolean;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Additional class names for container
   */
  className?: string;
  
  /**
   * Additional class names for header
   */
  headerClassName?: string;
  
  /**
   * Additional class names for content
   */
  contentClassName?: string;
}

/**
 * Reusable info card component with optional glass effect
 * 
 * Features:
 * - Optional icon and title
 * - Glass morphism effect
 * - Clickable variant with hover effects
 * - Flexible content slot
 * 
 * @example
 * <InfoCard 
 *   title="Total Bookings"
 *   icon={<TicketIcon />}
 *   glass
 * >
 *   <p>42 bookings</p>
 * </InfoCard>
 */
export function InfoCard({
  title,
  icon,
  children,
  glass = false,
  clickable = false,
  onClick,
  className,
  headerClassName,
  contentClassName
}: InfoCardProps) {
  const cardClasses = cn(
    "transition-all duration-300",
    glass && "bg-white/5 backdrop-blur-sm border-white/10",
    clickable && "cursor-pointer hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]",
    !glass && "bg-zinc-900 border-zinc-800",
    className
  );

  const CardWrapper = clickable && onClick ? "button" : "div";

  return (
    <CardWrapper
      onClick={clickable ? onClick : undefined}
      className={cn(cardClasses, clickable && "text-left w-full")}
    >
      <Card className="bg-transparent border-0 shadow-none">
        {(title || icon) && (
          <CardHeader className={cn("pb-3", headerClassName)}>
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex-shrink-0 text-cyan-400">
                  {icon}
                </div>
              )}
              {title && (
                <CardTitle className="text-white text-base font-semibold">
                  {title}
                </CardTitle>
              )}
            </div>
          </CardHeader>
        )}
        
        <CardContent className={cn("text-white/80", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}

/**
 * InfoRow - display key-value pairs in info cards
 */
export interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={cn("flex justify-between items-center py-2 border-b border-white/10 last:border-0", className)}>
      <span className="text-white/60 text-sm">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

/**
 * InfoGrid - grid layout for multiple info items
 */
export interface InfoGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function InfoGrid({ children, columns = 2, className }: InfoGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-4",
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

/**
 * PriceDisplay component props
 */
export interface PriceDisplayProps {
  /**
   * Price amount (in base currency units)
   */
  amount: number;
  
  /**
   * Optional original price for showing discounts
   */
  originalAmount?: number;
  
  /**
   * Currency symbol
   * @default "RM"
   */
  currency?: string;
  
  /**
   * Size variant
   * @default "default"
   */
  size?: "sm" | "default" | "lg" | "xl";
  
  /**
   * Whether to show as discounted (strikethrough original)
   * @default false
   */
  showDiscount?: boolean;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Original price class names
   */
  originalClassName?: string;
}

/**
 * Reusable price display component with discount support
 * 
 * Features:
 * - Consistent price formatting
 * - Discount display with strikethrough
 * - Size variants
 * - Currency customization
 * 
 * @example
 * <PriceDisplay 
 *   amount={25}
 *   originalAmount={30}
 *   showDiscount
 *   size="lg"
 * />
 */
export function PriceDisplay({
  amount,
  originalAmount,
  currency = "RM",
  size = "default",
  showDiscount = false,
  className,
  originalClassName
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg font-semibold",
    xl: "text-2xl font-bold"
  };

  const hasDiscount = showDiscount && originalAmount && originalAmount > amount;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      {/* Current/Discounted Price */}
      <span className={cn(
        sizeClasses[size],
        hasDiscount ? "text-green-400" : "text-white",
        "font-medium"
      )}>
        {formatPrice(amount, currency)}
      </span>
      
      {/* Original Price (strikethrough if discounted) */}
      {hasDiscount && (
        <span className={cn(
          "text-sm text-white/40 line-through",
          originalClassName
        )}>
          {formatPrice(originalAmount, currency)}
        </span>
      )}
    </div>
  );
}

/**
 * PriceRange component for displaying price ranges (e.g., "RM15 - RM30")
 */
export interface PriceRangeProps {
  /**
   * Minimum price
   */
  min: number;
  
  /**
   * Maximum price
   */
  max: number;
  
  /**
   * Currency symbol
   * @default "RM"
   */
  currency?: string;
  
  /**
   * Size variant
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Display a price range
 * 
 * @example
 * <PriceRange min={15} max={30} />
 */
export function PriceRange({
  min,
  max,
  currency = "RM",
  size = "default",
  className
}: PriceRangeProps) {
  const sizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg font-semibold"
  };

  return (
    <span className={cn(
      sizeClasses[size],
      "text-white/80",
      className
    )}>
      {formatPrice(min, currency)} - {formatPrice(max, currency)}
    </span>
  );
}

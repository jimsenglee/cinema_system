import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Status types with corresponding colors
 */
export type StatusType = 
  | "success" 
  | "warning" 
  | "error" 
  | "info" 
  | "pending"
  | "active"
  | "inactive"
  | "completed"
  | "cancelled";

/**
 * StatusBadge component props
 */
export interface StatusBadgeProps {
  /**
   * Status type (determines color)
   */
  status: StatusType | string;
  
  /**
   * Display label (defaults to capitalized status)
   */
  label?: string;
  
  /**
   * Size variant
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  
  /**
   * Whether to show dot indicator
   * @default false
   */
  showDot?: boolean;
  
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Reusable status badge component with predefined color schemes
 * 
 * Features:
 * - Predefined status color schemes
 * - Optional dot indicator
 * - Size variants
 * - Automatic label capitalization
 * 
 * @example
 * <StatusBadge status="success" label="Confirmed" showDot />
 * <StatusBadge status="pending" />
 * <StatusBadge status="error" label="Failed" />
 */
export function StatusBadge({
  status,
  label,
  size = "default",
  showDot = false,
  className
}: StatusBadgeProps) {
  // Map status to color scheme
  const statusColors: Record<string, string> = {
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pending: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const dotColors: Record<string, string> = {
    success: "bg-green-400",
    warning: "bg-yellow-400",
    error: "bg-red-400",
    info: "bg-blue-400",
    pending: "bg-orange-400",
    active: "bg-green-400",
    inactive: "bg-gray-400",
    completed: "bg-green-400",
    cancelled: "bg-red-400",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    default: "w-2 h-2",
    lg: "w-2.5 h-2.5"
  };

  const colorClass = statusColors[status.toLowerCase()] || statusColors.info;
  const dotColor = dotColors[status.toLowerCase()] || dotColors.info;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border",
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span className={cn(
          "rounded-full animate-pulse",
          dotColor,
          dotSizeClasses[size]
        )} />
      )}
      {displayLabel}
    </Badge>
  );
}

/**
 * Movie status badge (specialized for movie statuses)
 */
export interface MovieStatusBadgeProps {
  status: "now_showing" | "coming_soon" | "ended";
  className?: string;
}

export function MovieStatusBadge({ status, className }: MovieStatusBadgeProps) {
  const statusMap: Record<string, { label: string; type: StatusType }> = {
    now_showing: { label: "Now Showing", type: "success" },
    coming_soon: { label: "Coming Soon", type: "info" },
    ended: { label: "Ended", type: "inactive" }
  };

  const config = statusMap[status] || { label: status, type: "info" };

  return (
    <StatusBadge 
      status={config.type}
      label={config.label}
      showDot={status === "now_showing"}
      className={className}
    />
  );
}

/**
 * Booking status badge (specialized for booking statuses)
 */
export interface BookingStatusBadgeProps {
  status: "confirmed" | "pending" | "cancelled" | "completed";
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const statusMap: Record<string, StatusType> = {
    confirmed: "success",
    pending: "pending",
    cancelled: "cancelled",
    completed: "completed"
  };

  return (
    <StatusBadge 
      status={statusMap[status] || "info"}
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      showDot={status === "confirmed"}
      className={className}
    />
  );
}

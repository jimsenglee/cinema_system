import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

/**
 * ImageWithFallback component props
 */
export interface ImageWithFallbackProps {
  /**
   * Image source URL
   */
  src: string;
  
  /**
   * Alt text for accessibility
   */
  alt: string;
  
  /**
   * Fallback content when image fails to load
   * Can be another image URL, icon, or React element
   */
  fallback?: string | React.ReactNode;
  
  /**
   * Container class name
   */
  containerClassName?: string;
  
  /**
   * Image class name
   */
  className?: string;
  
  /**
   * Whether to show loading skeleton
   * @default true
   */
  showSkeleton?: boolean;
}

/**
 * Image component with fallback and loading states
 * 
 * Features:
 * - Automatic fallback on image error
 * - Loading skeleton
 * - Customizable fallback content
 * - Maintains aspect ratio
 * 
 * @example
 * <ImageWithFallback 
 *   src={movie.posterUrl}
 *   alt={movie.title}
 *   className="rounded-lg"
 *   fallback={<ImageIcon />}
 * />
 */
export function ImageWithFallback({
  src,
  alt,
  fallback,
  containerClassName,
  showSkeleton = true,
  className
}: ImageWithFallbackProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Determine fallback content
  const renderFallback = () => {
    if (typeof fallback === "string") {
      return (
        <img 
          src={fallback} 
          alt={alt}
          className={cn("w-full h-full object-cover", className)}
        />
      );
    }
    
    if (fallback) {
      return fallback;
    }
    
    // Default fallback
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
        <ImageIcon className="w-12 h-12 text-zinc-600" />
      </div>
    );
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Loading skeleton */}
      {loading && showSkeleton && (
        <div className="absolute inset-0 animate-pulse bg-zinc-800" />
      )}
      
      {/* Error fallback */}
      {error ? (
        renderFallback()
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            loading ? "opacity-0" : "opacity-100",
            className
          )}
        />
      )}
    </div>
  );
}

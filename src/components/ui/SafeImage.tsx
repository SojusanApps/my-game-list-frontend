import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { cn } from "@/utils/cn";
import { Skeleton } from "./Skeleton";
import PlaceholderImage from "@/assets/images/Image_Placeholder.svg";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function SafeImage({ src, alt, className, fallback = PlaceholderImage, ...props }: SafeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use useLayoutEffect to check for cached images before paint
  useLayoutEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, [src]);

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setIsError(false);

    // Check again after mount/change
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  // If we have an error or no src, use fallback.
  // IMPORTANT: We use src if available, otherwise fallback.
  const displaySrc = isError || !src ? fallback : src;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full z-10" />}
      <img
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          isError && "grayscale opacity-50",
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { cn } from "@/utils/cn";
import { Skeleton } from "./Skeleton";
import { ImageFallback } from "./ImageFallback";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export function SafeImage({
  src,
  alt,
  className,
  fallback = <ImageFallback />,
  objectFit = "cover",
  ...props
}: SafeImageProps) {
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
    if (!src) {
      setIsLoading(false);
      setIsError(false);
      return;
    }

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

  const showFallback = isError || !src;

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  }[objectFit];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full z-10" />}

      {showFallback ? (
        <div className="w-full h-full">{fallback}</div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            objectFitClass,
            isLoading ? "opacity-0" : "opacity-100",
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
}

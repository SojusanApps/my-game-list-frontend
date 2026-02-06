import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { Skeleton } from "./Skeleton";
import { ImageFallback } from "./ImageFallback";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  loader?: React.ReactNode;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export function SafeImage({
  src,
  alt,
  className,
  fallback = <ImageFallback />,
  loader,
  objectFit = "cover",
  ...props
}: Readonly<SafeImageProps>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setIsError(false);
      return;
    }

    // Reset state for new image
    setIsError(false);

    // Check if the image is already complete (cached) immediately
    if (imgRef.current?.complete) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
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
      {isLoading && (loader || <Skeleton className="absolute inset-0 w-full h-full z-10" />)}

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

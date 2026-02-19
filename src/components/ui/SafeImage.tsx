import React, { useState, useEffect, useRef } from "react";
import { Box, Skeleton } from "@mantine/core";
import { ImageFallback } from "./ImageFallback";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  loader?: React.ReactNode;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  containerStyle?: React.CSSProperties;
}

export function SafeImage({
  src,
  alt,
  className,
  fallback = <ImageFallback />,
  loader,
  objectFit = "cover",
  containerStyle,
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

  return (
    <Box pos="relative" style={{ overflow: "hidden", ...containerStyle }} className={className}>
      {isLoading &&
        (loader || <Skeleton style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 10 }} />)}

      {showFallback ? (
        <Box w="100%" h="100%">
          {fallback}
        </Box>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            transition: "opacity 300ms",
            objectFit: objectFit,
            opacity: isLoading ? 0 : 1,
          }}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </Box>
  );
}

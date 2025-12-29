import React from "react";
import AppLogo from "./AppLogo";
import { cn } from "@/utils/cn";

interface ImageFallbackProps {
  className?: string;
}

export function ImageFallback({ className }: ImageFallbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-background-100 text-text-500 w-full h-full p-2",
        className,
      )}
    >
      <AppLogo classNameSojusan="text-md text-primary-400" classNameGameList="text-base text-text-500" />
      <span className="text-lg font-medium uppercase tracking-wider mt-1 opacity-70">No Image</span>
    </div>
  );
}

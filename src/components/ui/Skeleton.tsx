import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: Readonly<SkeletonProps>) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-background-300", className)} {...props}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

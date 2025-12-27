import React from "react";
import { cn } from "@/utils/cn";

interface GridListProps {
  children: React.ReactNode;
  className?: string;
}

export function GridList({ children, className }: GridListProps) {
  return (
    <div
      className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4", className)}
    >
      {children}
    </div>
  );
}

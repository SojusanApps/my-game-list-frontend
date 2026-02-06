import React from "react";
import { cn } from "@/utils/cn";

interface GridListProps {
  children: React.ReactNode;
  className?: string;
  columnCount?: number;
}

export function GridList({ children, className, columnCount = 7 }: Readonly<GridListProps>) {
  return (
    <div
      className={cn(
        "grid gap-6",
        {
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7": columnCount === 7,
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4": columnCount === 4,
          "grid-cols-2": columnCount === 2,
          "grid-cols-3": columnCount === 3,
          "grid-cols-5": columnCount === 5,
          "grid-cols-8": columnCount === 8,
        },
        className,
      )}
      style={
        [2, 3, 4, 5, 7, 8].includes(columnCount)
          ? {}
          : { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }
      }
    >
      {children}
    </div>
  );
}

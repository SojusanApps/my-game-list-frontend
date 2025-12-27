import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  title: string;
  viewMoreHref?: string;
  className?: string;
}

export function SectionHeader({ title, viewMoreHref, className }: SectionHeaderProps) {
  return (
    <div className={cn("grid grid-cols-2 items-center mb-2", className)}>
      <h2 className="font-bold text-xl text-text-900">{title} &gt;</h2>
      {viewMoreHref && (
        <Link
          to={viewMoreHref}
          className="font-bold text-secondary-950 text-lg text-right hover:text-secondary-800 transition-colors"
        >
          View More
        </Link>
      )}
      <hr className="col-span-2 h-px my-1 bg-gray-300 border-0" />
    </div>
  );
}

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
    <div className={cn("flex items-end justify-between mb-6 border-b border-background-200 pb-2", className)}>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-primary-600 rounded-full" />
        <h2 className="font-bold text-2xl text-text-900 tracking-tight">{title}</h2>
      </div>
      {viewMoreHref && (
        <Link
          to={viewMoreHref}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
        >
          View More
          <span className="text-lg">→</span>
        </Link>
      )}
    </div>
  );
}

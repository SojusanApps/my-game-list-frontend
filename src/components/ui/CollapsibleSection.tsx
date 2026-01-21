import * as React from "react";
import { cn } from "@/utils/cn";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";

export function CollapsibleSection({
  title,
  count,
  children,
  defaultOpen = false,
}: Readonly<{
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}>) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-background-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-text-900">{title}</h2>
          {count !== undefined && (
            <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        <ChevronDownIcon
          className={cn("w-5 h-5 text-text-400 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

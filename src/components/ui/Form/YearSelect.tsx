/* eslint-disable jsx-a11y/prefer-tag-over-role */
import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { FormError } from "./FormError";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";
import XMarkIcon from "@/components/ui/Icons/XMark";

type YearSelectProps = {
  id: string;
  name: string;
  required?: boolean;
  label: string;
  placeholder: string;
  className?: string;
  startYear?: number;
  endYear?: number;
};

export default function YearSelect({
  id,
  name,
  required = false,
  label,
  placeholder,
  className,
  startYear = 1950,
  endYear = new Date().getFullYear() + 5,
}: Readonly<YearSelectProps>) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedValue = watch(name);

  // Generate years in descending order
  const years = React.useMemo(() => {
    const yearsArray = [];
    for (let i = endYear; i >= startYear; i--) {
      yearsArray.push(i);
    }
    return yearsArray;
  }, [startYear, endYear]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (year: number) => {
    // We store as ISO date string for compatibility with existing backend logic (e.g. 2023-01-01)
    // or just the year string. Given current logic uses Date, let's provide a valid date string.
    const dateString = `${year}-01-01`;
    setValue(name, dateString, { shouldValidate: true, shouldDirty: true });
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!selectedValue) return placeholder;
    return selectedValue.toString().split("-")[0]; // Extract year from "YYYY-MM-DD"
  };

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <div className={cn("flex flex-col gap-1.5", className)} ref={containerRef}>
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
          <div className="relative">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsOpen(!isOpen)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }
              }}
              className={cn(
                "flex items-center justify-between px-3 h-10 w-full rounded-md border border-background-300 bg-white cursor-pointer transition-all hover:border-background-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                isOpen && "ring-2 ring-primary-500 ring-offset-1 border-transparent shadow-sm",
                errorMessage && "border-error-500 focus:ring-error-500",
              )}
            >
              <span className={cn("text-sm truncate", selectedValue ? "text-text-900 font-medium" : "text-text-400")}>
                {getDisplayValue()}
              </span>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {selectedValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-0.5 rounded-full hover:bg-background-100 text-text-400 hover:text-text-600 transition-colors"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                )}
                <ChevronDownIcon className={cn("w-4 h-4 text-text-400 transition-transform", isOpen && "rotate-180")} />
              </div>
            </div>

            {isOpen && (
              <div className="absolute z-100 mt-2 w-full bg-white rounded-xl shadow-2xl border border-background-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <ul className="max-h-60 overflow-y-auto p-1 flex flex-col gap-0.5 custom-scrollbar">
                  {years.map(year => (
                    <li key={year}>
                      <button
                        type="button"
                        onClick={() => handleSelect(year)}
                        className={cn(
                          "w-full px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-between group",
                          selectedValue?.toString().startsWith(year.toString())
                            ? "bg-primary-50 text-primary-700 font-bold"
                            : "text-text-700 hover:bg-background-50",
                        )}
                      >
                        {year}
                        {selectedValue?.toString().startsWith(year.toString()) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-primary" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}

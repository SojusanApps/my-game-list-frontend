import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { FormError } from "./FormError";
import XMarkIcon from "@/components/ui/Icons/XMark";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";
import { useDebounce } from "@/utils/hooks";
import { InfiniteData } from "@tanstack/react-query";

type PaginatedResponse<T> = {
  results: T[];
  next?: string | null;
  count: number;
};

type AsyncMultiSelectAutocompleteProps<T> = {
  id: string;
  name: string;
  required?: boolean;
  label: string;
  placeholder: string;
  useInfiniteQueryHook: (searchTerm: string) => {
    data: InfiniteData<PaginatedResponse<T>> | undefined;
    isLoading: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
  };
  className?: string;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string | number;
};

export default function AsyncMultiSelectAutocomplete<T>({
  id,
  name,
  required = false,
  label,
  placeholder,
  useInfiniteQueryHook,
  className,
  getOptionLabel,
  getOptionValue,
}: Readonly<AsyncMultiSelectAutocompleteProps<T>>) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLSelectElement>(null);

  const watchedValues = watch(name);
  const selectedValues = React.useMemo(() => watchedValues || [], [watchedValues]);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQueryHook(debouncedSearch);

  const allOptions = React.useMemo(() => data?.pages.flatMap(page => page.results) || [], [data]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLSelectElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const toggleOption = (option: T) => {
    const value = getOptionValue(option).toString();
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v: string) => v !== value)
      : [...selectedValues, value];
    setValue(name, newValues, { shouldValidate: true, shouldDirty: true });
  };

  const removeValue = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v: string) => v !== value);
    setValue(name, newValues, { shouldValidate: true, shouldDirty: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && allOptions.length > 0) {
      e.preventDefault();
      toggleOption(allOptions[0]);
      setSearchTerm("");
    }
  };

  const errorMessage = errors[name]?.message as string | undefined;

  const dropdownContent = React.useMemo(() => {
    if (isLoading && allOptions.length === 0) {
      return (
        <option disabled className="animate-pulse px-3 py-4 text-center text-xs italic text-text-400">
          Searching...
        </option>
      );
    }

    if (allOptions.length === 0) {
      return (
        <option disabled className="px-3 py-4 text-center text-xs italic text-text-400">
          No results found
        </option>
      );
    }

    return (
      <>
        {allOptions.map(option => {
          const val = getOptionValue(option).toString();
          const isSelected = selectedValues.includes(val);
          return (
            <option
              key={val}
              value={val}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm transition-colors outline-hidden focus:bg-background-50",
                isSelected ? "bg-primary-50 font-bold text-primary-700" : "text-text-700 hover:bg-background-50",
              )}
            >
              {isSelected ? "✓ " : ""}
              {getOptionLabel(option)}
            </option>
          );
        })}
        {isFetchingNextPage && (
          <option disabled className="px-3 py-2 text-center">
            Loading more...
          </option>
        )}
      </>
    );
  }, [isLoading, allOptions, selectedValues, getOptionValue, getOptionLabel, isFetchingNextPage]);

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
            <label
              htmlFor={id}
              className={cn(
                "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-background-300 bg-white px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-1 cursor-text",
                isOpen && "border-transparent ring-2 ring-primary-500 ring-offset-1",
                errorMessage && "border-error-500 focus-within:ring-error-500",
              )}
            >
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                {selectedValues.map((val: string) => {
                  const option = allOptions.find(o => getOptionValue(o).toString() === val);
                  return (
                    <span
                      key={val}
                      className="inline-flex shrink-0 animate-in fade-in zoom-in items-center gap-1 whitespace-nowrap rounded bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-700 duration-200"
                    >
                      {option ? getOptionLabel(option) : val}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          removeValue(e, val);
                        }}
                        onMouseDown={e => e.stopPropagation()}
                        className="transition-colors hover:text-primary-900"
                        aria-label={`Remove ${option ? getOptionLabel(option) : val}`}
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
                <input
                  id={id}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  aria-controls={isOpen ? `${id}-listbox` : undefined}
                  type="text"
                  placeholder={selectedValues.length === 0 ? placeholder : ""}
                  className="h-full min-w-30 flex-1 border-none bg-transparent text-sm outline-hidden placeholder:text-text-400"
                  value={searchTerm}
                  onKeyDown={e => {
                    handleKeyDown(e);
                    if (e.key === "ArrowDown") {
                      setIsOpen(true);
                    }
                  }}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                className="ml-1 focus:outline-hidden"
                onClick={e => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                aria-label={isOpen ? "Close suggestions" : "Open suggestions"}
                aria-expanded={isOpen}
                aria-controls={isOpen ? `${id}-listbox` : undefined}
              >
                <ChevronDownIcon
                  className={cn("ml-1 h-4 w-4 shrink-0 text-text-400 transition-transform", isOpen && "rotate-180")}
                />
              </button>
            </label>

            {isOpen && (
              <div className="absolute z-100 mt-2 w-full animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-xl border border-background-200 bg-white shadow-2xl duration-200">
                <select
                  id={`${id}-listbox`}
                  multiple
                  size={Math.min(allOptions.length || 1, 10)}
                  ref={dropdownRef}
                  onScroll={handleScroll}
                  className="custom-scrollbar flex max-h-60 w-full flex-col gap-0.5 overflow-y-auto border-none p-1 outline-hidden focus:ring-0"
                  onMouseDown={e => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === "OPTION") {
                      e.preventDefault();
                      const value = (target as HTMLOptionElement).value;
                      const opt = allOptions.find(o => getOptionValue(o).toString() === value);
                      if (opt) toggleOption(opt);
                    }
                  }}
                  onChange={() => {}} // Selection is handled via onMouseDown to allow toggle behavior
                >
                  {dropdownContent}
                </select>
              </div>
            )}
          </div>
          <FormError message={errorMessage} />
        </div>
      )}
    />
  );
}

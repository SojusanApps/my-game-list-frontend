import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/utils/cn";
import { Label } from "./Label";
import { FormError } from "./FormError";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";
import XMarkIcon from "@/components/ui/Icons/XMark";
import { useDebounce } from "@/utils/hooks";
import { InfiniteData } from "@tanstack/react-query";

type PaginatedResponse<T> = {
  results: T[];
  next?: string | null;
  count: number;
};

type AsyncAutocompleteProps<T> = {
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

interface DropdownListProps<T> {
  isLoading: boolean;
  allOptions: T[];
  handleSelect: (option: T) => void;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string | number;
  selectedValue: string | number | undefined;
  isFetchingNextPage: boolean;
}

function DropdownList<T>({
  isLoading,
  allOptions,
  handleSelect,
  getOptionLabel,
  getOptionValue,
  selectedValue,
  isFetchingNextPage,
}: Readonly<DropdownListProps<T>>) {
  if (isLoading && allOptions.length === 0) {
    return <li className="px-3 py-4 text-center text-text-400 text-xs italic animate-pulse">Searching...</li>;
  }

  if (allOptions.length > 0) {
    return (
      <>
        {allOptions.map(option => {
          const isSelected = selectedValue?.toString() === getOptionValue(option).toString();
          return (
            <li key={getOptionValue(option)}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors flex items-center justify-between group",
                  isSelected ? "bg-primary-50 text-primary-700 font-bold" : "text-text-700 hover:bg-background-50",
                )}
              >
                {getOptionLabel(option)}
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-primary" />}
              </button>
            </li>
          );
        })}
        {isFetchingNextPage && (
          <li className="px-3 py-2 text-center">
            <span className="loading loading-spinner loading-xs text-primary-500"></span>
          </li>
        )}
      </>
    );
  }

  return <li className="px-3 py-4 text-center text-text-400 text-xs italic">No results found</li>;
}

export default function AsyncAutocomplete<T>({
  id,
  name,
  required = false,
  label,
  placeholder,
  useInfiniteQueryHook,
  className,
  getOptionLabel,
  getOptionValue,
}: Readonly<AsyncAutocompleteProps<T>>) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLUListElement>(null);

  const selectedValue = watch(name);
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

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleContainerClick = (e: MouseEvent) => {
      // Don't focus if we clicked a button or the input itself
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.tagName === "INPUT") return;

      const input = document.getElementById(id);
      if (input) {
        (input as HTMLInputElement).focus();
      }
    };

    container.addEventListener("click", handleContainerClick);
    return () => container.removeEventListener("click", handleContainerClick);
  }, [id]);

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSelect = (option: T) => {
    const value = getOptionValue(option);
    const itemLabel = getOptionLabel(option);
    setValue(name, value.toString(), { shouldValidate: true, shouldDirty: true });
    setSelectedLabel(itemLabel);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    setSelectedLabel(null);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && allOptions.length > 0) {
      e.preventDefault(); // Prevent accidental form submission
      handleSelect(allOptions[0]);
    }
  };

  const errorMessage = errors[name]?.message as string | undefined;

  // Sync selectedLabel if selectedValue changes externally
  React.useEffect(() => {
    if (selectedValue && allOptions.length > 0) {
      const selectedOption = allOptions.find(o => getOptionValue(o).toString() === selectedValue.toString());
      if (selectedOption) {
        setSelectedLabel(getOptionLabel(selectedOption));
      }
    } else if (!selectedValue) {
      setSelectedLabel(null);
    }
  }, [selectedValue, allOptions, getOptionLabel, getOptionValue]);

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
              className={cn(
                "flex items-center gap-2 px-3 h-10 w-full rounded-md border border-background-300 bg-white cursor-text transition-all focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-1",
                isOpen && "ring-2 ring-primary-500 ring-offset-1 border-transparent",
                errorMessage && "border-error-500 focus-within:ring-error-500",
              )}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0 h-full">
                {selectedLabel && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-100 text-primary-700 text-[10px] font-bold animate-in fade-in zoom-in duration-200 whitespace-nowrap shrink-0">
                    {selectedLabel}
                    <button type="button" onClick={handleClear} className="hover:text-primary-900 transition-colors">
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <input
                  id={id}
                  type="text"
                  placeholder={selectedLabel ? "" : placeholder}
                  className="flex-1 bg-transparent border-none outline-hidden text-sm placeholder:text-text-400 h-full min-w-30"
                  value={searchTerm}
                  onKeyDown={handleKeyDown}
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
                onClick={e => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="focus:outline-hidden"
                tabIndex={-1} // Skip tab index as the input handles the main focus
              >
                <ChevronDownIcon
                  className={cn("w-4 h-4 text-text-400 transition-transform shrink-0 ml-1", isOpen && "rotate-180")}
                />
              </button>
            </div>

            {isOpen && (
              <div className="absolute z-100 mt-2 w-full bg-white rounded-xl shadow-2xl border border-background-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <ul
                  ref={dropdownRef}
                  onScroll={handleScroll}
                  className="max-h-60 overflow-y-auto p-1 flex flex-col gap-0.5 custom-scrollbar"
                >
                  <DropdownList
                    isLoading={isLoading}
                    allOptions={allOptions}
                    handleSelect={handleSelect}
                    getOptionLabel={getOptionLabel}
                    getOptionValue={getOptionValue}
                    selectedValue={selectedValue}
                    isFetchingNextPage={isFetchingNextPage}
                  />
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

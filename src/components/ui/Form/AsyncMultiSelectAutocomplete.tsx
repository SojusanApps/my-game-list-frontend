import * as React from "react";
import { MultiSelect, Loader } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
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
  style?: React.CSSProperties;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string | number;
  renderOption?: (item: T) => React.ReactNode;
  hideTags?: boolean;
  onAdd?: (item: T) => void;
  onRemove?: (item: T) => void;
  value?: string[];
  onChange?: (value: string[]) => void;
  error?: React.ReactNode;
};

export default function AsyncMultiSelectAutocomplete<T>({
  id,
  name,
  required = false,
  label,
  placeholder,
  useInfiniteQueryHook,
  className,
  style,
  getOptionLabel,
  getOptionValue,
  value,
  onChange,
  error,
}: Readonly<AsyncMultiSelectAutocompleteProps<T>>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 300);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQueryHook(debouncedSearch);

  const allOptions = React.useMemo(() => data?.pages.flatMap(page => page.results) || [], [data]);

  const selectData = React.useMemo(() => {
    const seen = new Set<string>();
    return allOptions
      .map(item => ({
        value: getOptionValue(item).toString(),
        label: getOptionLabel(item),
      }))
      .filter(option => {
        if (seen.has(option.value)) {
          return false;
        }
        seen.add(option.value);
        return true;
      });
  }, [allOptions, getOptionLabel, getOptionValue]);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleDropdownScroll = React.useCallback(() => {
    const viewport = dropdownRef.current;
    if (!viewport) return;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <MultiSelect
      id={id}
      name={name}
      label={label}
      placeholder={placeholder}
      required={required}
      className={className}
      style={style}
      data={selectData}
      value={value}
      onChange={onChange}
      error={error}
      searchable
      clearable
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      scrollAreaProps={{ viewportRef: dropdownRef, onScrollPositionChange: handleDropdownScroll }}
      rightSection={isLoading || isFetchingNextPage ? <Loader size="xs" /> : undefined}
      nothingFoundMessage={isLoading ? "Searching..." : "No results found"}
    />
  );
}

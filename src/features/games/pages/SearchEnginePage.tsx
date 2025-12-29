import * as React from "react";
import ItemOverlay from "@/components/ui/ItemOverlay";
import GameSearchFilter, {
  ValidationSchema as GameSearchFilterValidationSchema,
} from "@/features/games/components/GameSearchFilter";
import CompanySearchFilter, {
  ValidationSchema as CompanySearchFilterValidationSchema,
} from "@/features/games/components/CompanySearchFilter";
import UserSearchFilter, {
  ValidationSchema as UserSearchFilterValidationSchema,
} from "@/features/users/components/UserSearchFilter";
import IGDBImageSize, { getIGDBImageURL } from "@/features/games/utils/IGDBIntegration";
import { Game, Company, User, PaginatedCompanyList, PaginatedGameList, PaginatedUserList } from "@/client";
import { useSearchInfiniteQuery, SearchCategory } from "@/features/games/hooks/useSearchQueries";
import { InfiniteData } from "@tanstack/react-query";
import { PageMeta } from "@/components/ui/PageMeta";
import { Skeleton } from "@/components/ui/Skeleton";
import { GridList } from "@/components/ui/GridList";
import { VirtualGridList } from "@/components/ui/VirtualGridList";
import { cn } from "@/utils/cn";
import ChevronDownIcon from "@/components/ui/Icons/ChevronDown";
import SearchIcon from "@/components/ui/Icons/Search";

type searchResultsType = PaginatedCompanyList | PaginatedGameList | PaginatedUserList | undefined;

type SearchFilterValidatorsType =
  | GameSearchFilterValidationSchema
  | CompanySearchFilterValidationSchema
  | UserSearchFilterValidationSchema;

function DisplaySearchResults({
  selectedCategory,
  searchResults,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Readonly<{
  selectedCategory: string | null;
  searchResults: InfiniteData<searchResultsType>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}>): React.JSX.Element {
  if (searchResults === undefined || searchResults.pages.length === 0) {
    return <p>No results</p>;
  }

  const allItems = searchResults.pages
    .map(page => page?.results)
    .filter(Boolean)
    .flat();

  const renderItem = (item: unknown) => {
    switch (selectedCategory) {
      case "games": {
        const game = item as Game;
        return (
          <ItemOverlay
            key={game.id}
            className="w-full"
            name={game.title}
            itemPageUrl={`/game/${game.id}`}
            itemCoverUrl={
              game.cover_image_id ? getIGDBImageURL(game.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null
            }
          />
        );
      }
      case "companies": {
        const company = item as Company;
        return (
          <ItemOverlay
            key={company.id}
            className="w-full"
            variant="logo"
            name={company.name}
            itemPageUrl={`/company/${company.id}`}
            itemCoverUrl={
              company.company_logo_id ? getIGDBImageURL(company.company_logo_id, IGDBImageSize.COVER_BIG_264_374) : null
            }
          />
        );
      }
      case "users": {
        const user = item as User;
        return (
          <ItemOverlay
            key={user.id}
            className="w-full"
            name={user.username}
            itemPageUrl={`/profile/${user.id}`}
            itemCoverUrl={user.gravatar_url}
          />
        );
      }
      default:
        return null;
    }
  };

  const columnCount = selectedCategory === "companies" ? 5 : 7;
  const rowHeight = selectedCategory === "companies" ? 220 : 300;

  return (
    <VirtualGridList
      items={allItems}
      renderItem={renderItem}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      columnCount={columnCount}
      rowHeight={rowHeight}
      className="h-200"
    />
  );
}

export default function SearchEnginePage(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = React.useState<SearchCategory | null>("games");
  const [filters, setFilters] = React.useState<object>({});
  const [isFiltersExpanded, setIsFiltersExpanded] = React.useState(true);
  const [hasSearched, setHasSearched] = React.useState(false);

  const {
    data: searchResults,
    error: errorFetchingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchInfiniteQuery(selectedCategory, filters, { enabled: hasSearched });

  const prepareFiltersForRequest = (data: SearchFilterValidatorsType) => {
    let filterData = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "" || value === undefined) {
        continue;
      }
      filterData = { ...filterData, [key]: value instanceof Date ? value.toISOString().split("T")[0] : value };
    }

    setFilters(filterData);
    setHasSearched(true);
    // Optionally collapse filters on search to show more results
    setIsFiltersExpanded(false);
  };

  const categories = [
    { id: "games", label: "Games" },
    { id: "companies", label: "Companies" },
    { id: "users", label: "Users" },
  ] as const;

  return (
    <div className="py-12 bg-background-200 min-h-screen">
      <PageMeta title="Search Engine" />
      <div className="flex flex-col gap-10 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-text-900 tracking-tight">Search Engine</h1>

          <div className="flex p-1 bg-background-300 rounded-xl">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setHasSearched(false);
                  setIsFiltersExpanded(true);
                }}
                className={cn(
                  "px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                  selectedCategory === cat.id
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-text-600 hover:text-text-900",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "bg-white rounded-2xl shadow-sm border border-background-200 transition-all duration-300",
            !isFiltersExpanded && "overflow-hidden",
          )}
        >
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="w-full flex items-center justify-between p-6 hover:bg-background-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary-600 rounded-full" />
              <h2 className="font-bold text-xl text-text-900">Filters</h2>
            </div>
            <ChevronDownIcon
              className={cn(
                "w-5 h-5 text-text-400 transition-transform duration-300",
                isFiltersExpanded && "rotate-180",
              )}
            />
          </button>

          <div
            className={cn(
              "px-8 pb-8 transition-all duration-300 ease-in-out",
              isFiltersExpanded ? "max-h-250 opacity-100 overflow-visible" : "max-h-0 opacity-0 overflow-hidden",
            )}
          >
            {selectedCategory === "games" && (
              <GameSearchFilter onSubmitHandlerCallback={data => prepareFiltersForRequest(data)} />
            )}
            {selectedCategory === "companies" && (
              <CompanySearchFilter onSubmitHandlerCallback={data => prepareFiltersForRequest(data)} />
            )}
            {selectedCategory === "users" && (
              <UserSearchFilter onSubmitHandlerCallback={data => prepareFiltersForRequest(data)} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-background-200 p-8 min-h-212.5 relative">
          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary-50/50">
                <SearchIcon className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-2xl font-bold text-text-900 mb-2">Ready to explore?</h3>
              <p className="text-text-500 max-w-sm mx-auto">
                Adjust the filters above and click the button to search for your favorite {selectedCategory}.
              </p>
            </div>
          ) : isLoading && !isFetchingNextPage ? (
            <GridList className={cn(selectedCategory === "companies" ? "xl:grid-cols-5" : "xl:grid-cols-7")}>
              {Array.from({ length: 21 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={cn(
                    "w-full rounded-xl",
                    selectedCategory === "companies" ? "aspect-3/2" : "aspect-264/374",
                  )}
                />
              ))}
            </GridList>
          ) : searchResults ? (
            <DisplaySearchResults
              selectedCategory={selectedCategory}
              searchResults={searchResults}
              fetchNextPage={fetchNextPage}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-text-400">
              <p className="text-lg font-medium">No results found for your search.</p>
            </div>
          )}
          {errorFetchingData && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-4 mt-4">
              <p className="text-error-600 text-center font-medium">Error: {errorFetchingData.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

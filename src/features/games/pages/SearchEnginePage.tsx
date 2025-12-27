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

type searchResultsType = PaginatedCompanyList | PaginatedGameList | PaginatedUserList | undefined;

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

  return (
    <VirtualGridList
      items={allItems}
      renderItem={renderItem}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      className="h-[calc(100vh-400px)]"
    />
  );
}

export default function SearchEnginePage(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = React.useState<SearchCategory | null>(null);
  const [filters, setFilters] = React.useState<object>({});
  type SearchFilterValidatorsType =
    | GameSearchFilterValidationSchema
    | CompanySearchFilterValidationSchema
    | UserSearchFilterValidationSchema;

  const {
    data: searchResults,
    error: errorFetchingData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchInfiniteQuery(selectedCategory, filters);

  const prepareFiltersForRequest = (data: SearchFilterValidatorsType) => {
    let filterData = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "" || value === undefined) {
        continue;
      }
      filterData = { ...filterData, [key]: value instanceof Date ? value.toISOString().split("T")[0] : value };
    }

    return filterData;
  };

  return (
    <div className="py-8">
      <PageMeta title="Search Engine" />
      <div className="flex flex-col gap-8 max-w-[70%] mt-2 mx-auto">
        <div className="join mx-auto">
          <input
            className="join-item btn min-w-32"
            value="games"
            type="radio"
            name="options"
            aria-label="Games"
            onChange={() => setSelectedCategory("games")}
          />
          <input
            className="join-item btn min-w-32"
            value="companies"
            type="radio"
            name="options"
            aria-label="Companies"
            onChange={() => setSelectedCategory("companies")}
          />
          <input
            className="join-item btn min-w-32"
            value="users"
            type="radio"
            name="options"
            aria-label="Users"
            onChange={() => setSelectedCategory("users")}
          />
        </div>
        <div className="border border-background-300 rounded-xl p-6 bg-background-200 shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-text-900">Filters</h2>
          {selectedCategory === "games" && (
            <GameSearchFilter onSubmitHandlerCallback={data => setFilters(prepareFiltersForRequest(data))} />
          )}
          {selectedCategory === "companies" && (
            <CompanySearchFilter onSubmitHandlerCallback={data => setFilters(prepareFiltersForRequest(data))} />
          )}
          {selectedCategory === "users" && (
            <UserSearchFilter onSubmitHandlerCallback={data => setFilters(prepareFiltersForRequest(data))} />
          )}
        </div>
        <div>
          {isLoading && !isFetchingNextPage ? (
            <GridList>
              {Array.from({ length: 14 }).map((_, i) => (
                <Skeleton key={i} className="aspect-264/374 w-full" />
              ))}
            </GridList>
          ) : (
            searchResults && (
              <DisplaySearchResults
                selectedCategory={selectedCategory}
                searchResults={searchResults}
                fetchNextPage={fetchNextPage}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            )
          )}
          {errorFetchingData && <p className="text-error text-center mt-4">Error: {errorFetchingData.message}</p>}
        </div>
      </div>
    </div>
  );
}

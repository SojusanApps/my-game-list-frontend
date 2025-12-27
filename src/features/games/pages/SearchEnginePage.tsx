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
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

type searchResultsType = PaginatedCompanyList | PaginatedGameList | PaginatedUserList | undefined;

function GamesItems({ gamesItems }: Readonly<{ gamesItems: Game[] | null }>): React.JSX.Element {
  return (
    <GridList>
      {gamesItems?.map(gameItem => (
        <ItemOverlay
          key={gameItem.id}
          className="w-full"
          name={gameItem.title}
          itemPageUrl={`/game/${gameItem.id}`}
          itemCoverUrl={
            gameItem.cover_image_id ? getIGDBImageURL(gameItem.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null
          }
        />
      ))}
    </GridList>
  );
}

function CompanyItems({ companyItems }: Readonly<{ companyItems: Company[] | null }>): React.JSX.Element {
  return (
    <GridList>
      {companyItems?.map(companyItem => (
        <ItemOverlay
          key={companyItem.id}
          className="w-full"
          name={companyItem.name}
          itemPageUrl={`/company/${companyItem.id}`}
          itemCoverUrl={
            companyItem.company_logo_id
              ? getIGDBImageURL(companyItem.company_logo_id, IGDBImageSize.COVER_BIG_264_374)
              : null
          }
        />
      ))}
    </GridList>
  );
}

function UsersItems({ usersItems }: Readonly<{ usersItems: User[] | null }>): React.JSX.Element {
  return (
    <GridList>
      {usersItems?.map(userItem => (
        <ItemOverlay
          key={userItem.id}
          className="w-full"
          name={userItem.username}
          itemPageUrl={`/profile/${userItem.id}`}
          itemCoverUrl={userItem.gravatar_url}
        />
      ))}
    </GridList>
  );
}

function DisplaySearchResults({
  selectedCategory,
  searchResults,
}: Readonly<{ selectedCategory: string | null; searchResults: InfiniteData<searchResultsType> }>): React.JSX.Element {
  if (searchResults === undefined || searchResults.pages.length === 0) {
    return <p>No results</p>;
  }
  switch (selectedCategory) {
    case "games":
      return (
        <GamesItems
          gamesItems={searchResults.pages
            .map(page => (page as PaginatedGameList)?.results)
            .filter(Boolean)
            .flat()}
        />
      );
    case "companies":
      return (
        <CompanyItems
          companyItems={searchResults.pages
            .map(page => (page as PaginatedCompanyList)?.results)
            .filter(Boolean)
            .flat()}
        />
      );
    case "users":
      return (
        <UsersItems
          usersItems={searchResults.pages
            .map(page => (page as PaginatedUserList)?.results)
            .filter(Boolean)
            .flat()}
        />
      );
    default:
      return <p>Select items to search for</p>;
  }
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

  const { ref: observerTargetRef } = useInfiniteScroll(fetchNextPage, {
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  });

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
            searchResults && DisplaySearchResults({ selectedCategory, searchResults })
          )}
          {isFetchingNextPage && (
            <GridList className="mt-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="aspect-264/374 w-full" />
              ))}
            </GridList>
          )}
          {errorFetchingData && <p className="text-error text-center mt-4">Error: {errorFetchingData.message}</p>}
          {hasNextPage && <div ref={observerTargetRef} className="h-10" />}
        </div>
      </div>
    </div>
  );
}

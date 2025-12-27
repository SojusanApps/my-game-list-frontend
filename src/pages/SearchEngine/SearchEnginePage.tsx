import * as React from "react";

import ItemOverlay from "@/components/ItemOverlay/ItemOverlay";
import GameSearchFilter, {
  ValidationSchema as GameSearchFilterValidationSchema,
} from "@/components/Filters/GameSearch/GameSearchFilter";
import CompanySearchFilter, {
  ValidationSchema as CompanySearchFilterValidationSchema,
} from "@/components/Filters/CompanySearch/CompanySearchFilter";
import UserSearchFilter, {
  ValidationSchema as UserSearchFilterValidationSchema,
} from "@/components/Filters/UserSearch/UserSearchFilter";
import IGDBImageSize, { getIGDBImageURL } from "@/helpers/IGDBIntegration";
import { Game, Company, User, PaginatedCompanyList, PaginatedGameList, PaginatedUserList } from "@/client";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getGamesList, getCompaniesList } from "@/services/api/game";
import { getUserLists } from "@/services/api/user";
import { useInView } from "react-intersection-observer";

type searchResultsType = PaginatedCompanyList | PaginatedGameList | PaginatedUserList | undefined;

function GamesItems({ gamesItems }: Readonly<{ gamesItems: Game[] | null }>): React.JSX.Element {
  return (
    <div className="grid grid-cols-7 gap-1">
      {gamesItems?.map(gameItem => (
        <div key={gameItem.id}>
          <ItemOverlay
            className="flex-none"
            name={gameItem.title}
            itemPageUrl={`/game/${gameItem.id}`}
            itemCoverUrl={
              gameItem.cover_image_id ? getIGDBImageURL(gameItem.cover_image_id, IGDBImageSize.COVER_BIG_264_374) : null
            }
          />
        </div>
      ))}
    </div>
  );
}

function CompanyItems({ companyItems }: Readonly<{ companyItems: Company[] | null }>): React.JSX.Element {
  return (
    <div className="grid grid-cols-7 gap-1">
      {companyItems?.map(companyItem => (
        <div key={companyItem.id}>
          <ItemOverlay
            className="flex-none"
            name={companyItem.name}
            itemPageUrl={`/company/${companyItem.id}`}
            itemCoverUrl={
              companyItem.company_logo_id
                ? getIGDBImageURL(companyItem.company_logo_id, IGDBImageSize.COVER_BIG_264_374)
                : null
            }
          />
        </div>
      ))}
    </div>
  );
}

function UsersItems({ usersItems }: Readonly<{ usersItems: User[] | null }>): React.JSX.Element {
  return (
    <div className="grid grid-cols-7 gap-1">
      {usersItems?.map(userItem => (
        <div key={userItem.id}>
          <ItemOverlay
            className="flex-none"
            name={userItem.username}
            itemPageUrl={`/profile/${userItem.id}`}
            itemCoverUrl={userItem.gravatar_url}
          />
        </div>
      ))}
    </div>
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
      return <GamesItems gamesItems={searchResults.pages.map(page => page?.results).flat() as Game[]} />;
    case "companies":
      return <CompanyItems companyItems={searchResults.pages.map(page => page?.results).flat() as Company[]} />;
    case "users":
      return <UsersItems usersItems={searchResults.pages.map(page => page?.results).flat() as User[]} />;
    default:
      return <p>Select items to search for</p>;
  }
}

type FetchItemsQueryKey = ["search-results", string, object];

const fetchItems = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | object | null)[];
}) => {
  const [, category, filters] = queryKey as FetchItemsQueryKey;
  const query = { page: pageParam, ...filters };
  let data;
  switch (category) {
    case "games":
      data = await getGamesList(query);
      break;
    case "companies":
      data = await getCompaniesList(query);
      break;
    case "users":
      data = await getUserLists(query);
      break;
    default:
      throw new Error("Invalid category");
  }
  return data;
};

export default function SearchEnginePage(): React.JSX.Element {
  const { ref: observerTargetRef, inView } = useInView({ threshold: 1 });
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
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
  } = useInfiniteQuery({
    queryKey: ["search-results", selectedCategory, filters],
    queryFn: fetchItems,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.next !== null && lastPage.next !== undefined) {
        return lastPageParam + 1;
      }
      return null;
    },
    enabled: !!selectedCategory,
  });

  React.useEffect(() => {
    if (selectedCategory === null) {
      return;
    }
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, filters]);

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
    <div>
      <div className="flex flex-col gap-8 max-w-[60%] mt-2 mx-auto">
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
        <div className="border border-background-300 rounded-xl p-2 bg-background-200">
          <p>Filters</p>
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
          {searchResults && DisplaySearchResults({ selectedCategory, searchResults })}
          {(isFetchingNextPage || isLoading) && <p>Loading ...</p>}
          {errorFetchingData && <p>Error: {errorFetchingData.message}</p>}
          {hasNextPage && <div ref={observerTargetRef} />}
        </div>
      </div>
    </div>
  );
}

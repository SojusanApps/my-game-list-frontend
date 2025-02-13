import * as React from "react";

import { SubmitHandler } from "react-hook-form";
import ItemOverlay from "../../components/ItemOverlay/ItemOverlay";
import StatusCode from "../../helpers/StatusCode";
import GameSearchFilter, {
  ValidationSchema as GameSearchFilterValidationSchema,
} from "../../components/Filters/GameSearch/GameSearchFilter";
import CompanySearchFilter, {
  ValidationSchema as CompanySearchFilterValidationSchema,
} from "../../components/Filters/CompanySearch/CompanySearchFilter";
import UserSearchFilter, {
  ValidationSchema as UserSearchFilterValidationSchema,
} from "../../components/Filters/UserSearch/UserSearchFilter";
import IGDBImageSize, { getIGDBImageURL } from "../../helpers/IGDBIntegration";
import { GameService, UserService, Game, Company, User } from "../../client";

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

export default function SearchEnginePage(): React.JSX.Element {
  const [dataItems, setDataItems] = React.useState<Game[] | User[] | Company[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorFetchingData, setErrorFetchingData] = React.useState<Error | null>(null);
  const observerTarget = React.useRef(null);
  const nextPageNumberRef = React.useRef<number | null>(1);
  const searchSourceRef = React.useRef("");
  const isLoadingRef = React.useRef(false);
  const filterBodyRef = React.useRef<object | undefined>(undefined);
  type SearchFilterValidatorsType =
    | GameSearchFilterValidationSchema
    | CompanySearchFilterValidationSchema
    | UserSearchFilterValidationSchema;

  const getRequestWithParams = () => {
    let request;
    let explodeSerializer = undefined;
    switch (searchSourceRef.current) {
      case "games":
        request = GameService.gameGamesList;
        explodeSerializer = true;
        break;
      case "companies":
        request = GameService.gameCompaniesList;
        break;
      case "users":
        request = UserService.userUsersList;
        break;
      default:
        request = null;
    }

    const requestParams: { query: { page: number | undefined }; querySerializer?: object } = {
      query: { page: nextPageNumberRef.current ?? undefined },
    };
    if (filterBodyRef.current) {
      requestParams.query = { ...requestParams.query, ...filterBodyRef.current };
    }
    if (explodeSerializer) {
      // There is a problem with querySerializer, for some it is set to not explode the arguments
      // in such cases it needs to be set manually
      requestParams.querySerializer = {
        array: {
          explode: true,
          style: "form",
        },
      };
    }

    return { requestFunction: request, requestParams };
  };

  const fetchData = async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    setErrorFetchingData(null);

    try {
      if (nextPageNumberRef.current === null) {
        return;
      }

      const { requestFunction, requestParams } = getRequestWithParams();
      if (!requestFunction) {
        return;
      }

      const { data: responseData, response } = await requestFunction(requestParams);
      if (response.status === StatusCode.OK && responseData) {
        const data = responseData.results;
        setDataItems(prevItems => [...prevItems, ...data] as typeof prevItems);
        if (responseData.next !== null && responseData.next !== undefined) {
          nextPageNumberRef.current = Number(new URL(responseData.next).searchParams.get("page")) || null;
        } else {
          nextPageNumberRef.current = null;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorFetchingData(error);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          // fetchData only when it is not already running
          if (!isLoadingRef.current) {
            fetchData();
          }
        }
      },
      {
        threshold: 1,
      },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);

  const handleSearchSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchSourceRef.current = event.target.value;
    filterBodyRef.current = undefined;
    nextPageNumberRef.current = 1;
    setDataItems([]);
    fetchData();
  };

  const getFilterBody = (data: SearchFilterValidatorsType) => {
    let filterUrl = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "" || value === undefined) {
        continue;
      }
      console.log(key, value);
      filterUrl = { ...filterUrl, [key]: value instanceof Date ? value.toISOString().split("T")[0] : value };
    }

    return filterUrl;
  };

  const submitFilterHandler: SubmitHandler<SearchFilterValidatorsType> = async (data: SearchFilterValidatorsType) => {
    setDataItems([]);
    nextPageNumberRef.current = 1;
    filterBodyRef.current = getFilterBody(data);
    fetchData();
  };

  return (
    <div>
      <div className="flex flex-col gap-8 max-w-[60%] mt-2 mx-auto">
        <div className="join mx-auto" onChange={handleSearchSourceChange}>
          <input className="join-item btn min-w-32" value="games" type="radio" name="options" aria-label="Games" />
          <input
            className="join-item btn min-w-32"
            value="companies"
            type="radio"
            name="options"
            aria-label="Companies"
          />
          <input className="join-item btn min-w-32" value="users" type="radio" name="options" aria-label="Users" />
        </div>
        <div className="border-[1px] border-background-300 rounded-xl p-2 bg-background-200">
          <p>Filters</p>
          {searchSourceRef.current === "games" && <GameSearchFilter onSubmitHandlerCallback={submitFilterHandler} />}
          {searchSourceRef.current === "companies" && (
            <CompanySearchFilter onSubmitHandlerCallback={submitFilterHandler} />
          )}
          {searchSourceRef.current === "users" && <UserSearchFilter onSubmitHandlerCallback={submitFilterHandler} />}
        </div>
        <div>
          {(dataItems.length === 0 && <p>No results</p>) ||
            (searchSourceRef.current === "games" && <GamesItems gamesItems={dataItems as Game[]} />) ||
            (searchSourceRef.current === "companies" && <CompanyItems companyItems={dataItems as Company[]} />) ||
            (searchSourceRef.current === "users" && <UsersItems usersItems={dataItems as User[]} />) || (
              <p>Select items to search for</p>
            )}
          {isLoading && <p>Loading ...</p>}
          {errorFetchingData && <p>Error: {errorFetchingData.message}</p>}
          <div ref={observerTarget} />
        </div>
      </div>
    </div>
  );
}

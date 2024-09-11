import * as React from "react";

import { SubmitHandler } from "react-hook-form";
import ItemOverlay from "../../components/ItemOverlay/ItemOverlay";
import { GameType } from "../../models/Game";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import StatusCode from "../../helpers/StatusCode";
import { UserType } from "../../models/User";
import { CompanyType } from "../../models/Company";
import GameSearchFilter, {
  ValidationSchema as GameSearchFilterValidationSchema,
} from "../../components/Filters/GameSearch/GameSearchFilter";
import CompanySearchFilter, { ValidationSchema as CompanySearchFilterValidationSchema } from "../../components/Filters/CompanySearch/CompanySearchFilter";
import UserSearchFilter, { ValidationSchema as UserSearchFilterValidationSchema } from "../../components/Filters/UserSearch/UserSearchFilter";
import IGDBImageSize, { getIGDBImageURL } from "../../helpers/IGDBIntegration";

function GamesItems({ gamesItems }: Readonly<{ gamesItems: GameType[] | null }>): React.JSX.Element {
  return (
    <div className="grid grid-cols-7 gap-1">
      {gamesItems?.map(gameItem => (
        <div key={gameItem.id}>
          <ItemOverlay
            className="flex-none"
            name={gameItem.title}
            itemPageUrl={`/game/${gameItem.id}`}
            itemCoverUrl={getIGDBImageURL(gameItem.cover_image_id, IGDBImageSize.COVER_BIG_264_374)}
          />
        </div>
      ))}
    </div>
  );
}

function CompanyItems({
  companyItems,
}: Readonly<{ companyItems: CompanyType[] | null }>): React.JSX.Element {
  return (
    <div className="grid grid-cols-7 gap-1">
      {companyItems?.map(companyItem => (
        <div key={companyItem.id}>
          <ItemOverlay
            className="flex-none"
            name={companyItem.name}
            itemPageUrl={`/company/${companyItem.id}`}
            itemCoverUrl={getIGDBImageURL(companyItem.company_logo_id, IGDBImageSize.COVER_BIG_264_374)}
          />
        </div>
      ))}
    </div>
  );
}

function UsersItems({ usersItems }: Readonly<{ usersItems: UserType[] | null }>): React.JSX.Element {
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
  const axiosPrivate = useAxiosPrivate();
  const [dataItems, setDataItems] = React.useState<GameType[] | UserType[] | CompanyType[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorFetchingData, setErrorFetchingData] = React.useState<Error | null>(null);
  const observerTarget = React.useRef(null);
  const nextPageUrlRef = React.useRef(undefined);
  const searchSourceRef = React.useRef("");
  const isLoadingRef = React.useRef(false);
  const filterUrlRef = React.useRef<string | undefined>(undefined);
  type SearchFilterValidatorsType = GameSearchFilterValidationSchema | CompanySearchFilterValidationSchema | UserSearchFilterValidationSchema;

  const getRequestUrl = () => {
    let baseUrl;
    switch (searchSourceRef.current) {
      case "games":
        baseUrl = "/game/games/";
        break;
      case "companies":
        baseUrl = "/game/companies/";
        break;
      case "users":
        baseUrl = "/user/users/";
        break;
      default:
        baseUrl = "";
    }

    if (filterUrlRef.current !== undefined) {
      baseUrl += filterUrlRef.current;
    }

    return baseUrl;
  };

  const fetchData = async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    setErrorFetchingData(null);

    try {
      let requestUrl;
      const nextPageUrl = nextPageUrlRef.current;
      if (nextPageUrl === undefined) {
        requestUrl = getRequestUrl();
      } else if (nextPageUrl === null) {
        return;
      } else {
        requestUrl = nextPageUrl;
      }

      const response = await axiosPrivate.get(requestUrl);
      if (response.status === StatusCode.OK) {
        const data = response.data.results;
        setDataItems(prevItems => [...prevItems, ...data]);
        nextPageUrlRef.current = response.data.next;
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
    filterUrlRef.current = undefined;
    nextPageUrlRef.current = undefined;
    setDataItems([]);
    fetchData();
  };

  const getFilterUrl = (data: SearchFilterValidatorsType) => {
    let filterUrl = "";
    for (let [key, value] of Object.entries(data)) {
      if (value === "" || value === undefined) {
        continue;
      }
      if (Array.isArray(value) && value.length > 0) {
        for (let arrayValue of value) {
          filterUrl += `&${key}=${arrayValue}`;
        }
        continue;
      }
      if (typeof value === 'object' && value instanceof Date) {
        filterUrl += `&${key}=${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
        continue;
      }
      filterUrl += `&${key}=${value}`;
    }
    filterUrl = new URLSearchParams(filterUrl).toString();
    filterUrl = `?${filterUrl}`;

    return filterUrl;
  };

  const submitFilterHandler: SubmitHandler<SearchFilterValidatorsType> = async (
    data: SearchFilterValidatorsType,
  ) => {
    setDataItems([]);
    nextPageUrlRef.current = undefined;
    filterUrlRef.current = getFilterUrl(data);
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
          {searchSourceRef.current === "companies" && <CompanySearchFilter onSubmitHandlerCallback={submitFilterHandler} />}
          {searchSourceRef.current === "users" && <UserSearchFilter onSubmitHandlerCallback={submitFilterHandler} />}
        </div>
        <div>
          {(dataItems.length === 0 && <p>No results</p>) ||
            (searchSourceRef.current === "games" && <GamesItems gamesItems={dataItems as GameType[]} />) ||
            (searchSourceRef.current === "companies" && (
              <CompanyItems companyItems={dataItems as CompanyType[]} />
            )) ||
            (searchSourceRef.current === "users" && <UsersItems usersItems={dataItems as UserType[]} />) || (
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

import { useEffect } from "react";
import { useInView, IntersectionOptions } from "react-intersection-observer";

interface UseInfiniteScrollOptions extends IntersectionOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
}

/**

 * Custom hook to abstract the logic for triggering the fetch of the next page

 * in an infinite scroll scenario.

 */

export function useInfiniteScroll(
  fetchNextPage: () => void,

  options: UseInfiniteScrollOptions = {},
) {
  const { hasNextPage, isFetchingNextPage, isLoading, ...intersectionOptions } = options;

  const { ref, inView } = useInView({
    threshold: 0,

    ...intersectionOptions,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  // Support for manual trigger based on virtual item index

  const checkTrigger = (currentIndex: number, totalCount: number) => {
    if (currentIndex >= totalCount - 5 && hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  return { ref, inView, checkTrigger };
}

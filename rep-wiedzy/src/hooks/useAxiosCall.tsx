import { useState, useEffect, useCallback } from "react";

type AsyncFn<T, Args extends any[]> = (...args: Args) => Promise<T>;

export function useAxiosCall<T, Args extends any[]>(
  fn: AsyncFn<T, Args>,
  args: Args,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);

  const refetch = useCallback(() => {
    setReloadFlag((f) => f + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fn(...args)
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadFlag, ...deps, ...args]);

  return { data, error, isLoading, refetch };
}

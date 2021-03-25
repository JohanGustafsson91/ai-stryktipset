import { useState, useRef, useEffect } from "react";

export function useLazyRequest<T>(): LazyRequestReturnTypes<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const cancelRequest = useRef<AbortController>();

  useEffect(() => {
    cancelRequest.current = new AbortController();
    return () => cancelRequest.current?.abort();
  }, []);

  const fetchRef = useRef(
    async (
      url: RequestInfo,
      init?: RequestInit,
      retryOptions?: RequestRetryOptions
    ) => {
      setLoading(true);
      setError(false);
      setData(null);

      try {
        const response = validateResponse(
          await request(
            url,
            {
              ...init,
              signal: cancelRequest.current?.signal,
            },
            retryOptions
          )
        );

        const data = await response.json();

        setData(data);
        setLoading(false);
      } catch (error) {
        if (error instanceof DOMException) return; // Request aborted
        setError(true);
        setLoading(false);
      }
    }
  );

  return [
    fetchRef.current,
    {
      data,
      loading,
      error,
    },
  ];
}

const request = async (
  url: RequestInfo,
  init: RequestInit,
  retryOptions: RequestRetryOptions = { numOfRetries: 0, waitMsBeforeRetry: 0 }
): Promise<Response> => {
  try {
    return validateResponse(await fetch(url, init));
  } catch (error) {
    if (retryOptions.numOfRetries > 0) {
      await delay(retryOptions.waitMsBeforeRetry);
      return request(url, init, {
        ...retryOptions,
        numOfRetries: retryOptions.numOfRetries - 1,
      });
    }

    throw error;
  }
};

const validateResponse = (response: Response): Response => {
  if (!response.ok) throw new Error(response.statusText);
  return response;
};

const delay = (timeInMs = 0) =>
  new Promise((resolve) => setTimeout(resolve, timeInMs));

type LazyRequestReturnTypes<T> = [
  LazyRequestFn,
  {
    data: T | null;
    loading: boolean;
    error: boolean;
  }
];

type LazyRequestFn = (
  url: RequestInfo,
  init?: RequestInit,
  retryOptions?: RequestRetryOptions
) => Promise<void>;

interface RequestRetryOptions {
  numOfRetries: number;
  waitMsBeforeRetry?: number;
}

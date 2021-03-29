import { useRef, useEffect } from "react";
import { State, useAsyncProgress } from "./ManageNet.useAsyncProgress";

export function useLazyRequest<T>(): LazyRequestReturnTypes<T> {
  const [state, dispatch] = useAsyncProgress<T>();
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
      dispatch({ type: "pending" });

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
        console.log(data);

        dispatch({ type: "fulfilled", payload: data });
      } catch (error) {
        if (cancelRequest.current?.signal.aborted) return;
        dispatch({ type: "rejected" });
      }
    }
  );

  return [fetchRef.current, state];
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

type LazyRequestReturnTypes<T> = [LazyRequestFn, State<T | null>];

type LazyRequestFn = (
  url: RequestInfo,
  init?: RequestInit,
  retryOptions?: RequestRetryOptions
) => Promise<void>;

interface RequestRetryOptions {
  numOfRetries: number;
  waitMsBeforeRetry?: number;
}

import React, { Reducer } from "react";
import { useState, useRef, useEffect, useReducer } from "react";

interface State<T> {
  data: T;
  loading: boolean;
  error: boolean;
}

type Action<T> =
  | { type: "pending" }
  | { type: "resolved"; payload: T }
  | { type: "rejected" };

function reducer<T>(state: State<T>, action: Action<T>) {
  switch (action.type) {
    case "pending": {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }
    case "resolved": {
      return { ...state, data: action.payload, loading: false, error: false };
    }
    case "rejected": {
      return { ...state, loading: false, error: true };
    }
    default:
      throw new Error();
  }
}

const initialState = {
  data: null,
  loading: true,
  error: true,
};

export function useLazyRequest<T>(): LazyRequestReturnTypes<T> {
  const [state, dispatch] = useReducer<Reducer<State<T | null>, Action<T>>>(
    reducer,
    initialState
  );
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

        dispatch({ type: "resolved", payload: data });
      } catch (error) {
        if (error instanceof DOMException) return; // Request aborted
        dispatch({ type: "rejected" });
      }
    }
  );

  console.log("STATE", state);

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

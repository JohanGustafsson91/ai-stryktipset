import { Reducer, useEffect, useReducer, useRef } from "react";

export function useAsyncTask<D>(
  retryOptions: RetryOptions = { numOfRetries: 0, waitMsBeforeRetry: 0 }
): ReturnTypes<D> {
  const [state, dispatch] = useReducer<TaskReducer<D>>(reducer, {
    data: null,
    status: "idle",
    error: null,
  });
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    abortController.current = new AbortController();

    return () => {
      abortController.current?.abort();
    };
  }, []);

  const taskRef = useRef(async (task: Task<D>) => {
    doTask(retryOptions.numOfRetries, retryOptions.waitMsBeforeRetry);

    async function doTask(retries = 0, delayMs = 0): Promise<void> {
      dispatch({ type: "pending" });

      try {
        const res = await task();
        if (abortController.current?.signal.aborted) return;
        dispatch({ type: "fulfilled", payload: res });
      } catch (error) {
        if (abortController.current?.signal.aborted) return;

        if (retries > 0) {
          await delay(delayMs);
          return doTask(retries - 1, delayMs);
        }

        dispatch({ type: "rejected", payload: error });
      }
    }
  });

  return [taskRef.current, state];
}

function reducer<T>(state: State<T>, action: Action<T>): State<Data<T>> {
  switch (action.type) {
    case "pending": {
      return {
        data: null,
        status: "pending",
        error: null,
      };
    }
    case "fulfilled": {
      return {
        data: action.payload,
        status: "fulfilled",
        error: null,
      };
    }
    case "rejected": {
      return {
        ...state,
        status: "rejected",
        error: action.payload,
      };
    }
    default:
      throw new Error();
  }
}

const delay = (timeInMs = 0) =>
  new Promise((resolve) => setTimeout(resolve, timeInMs));

interface RetryOptions {
  numOfRetries: number;
  waitMsBeforeRetry?: number;
}

type ReturnTypes<T> = [
  (arg: Task<T>) => void,
  { status: Status; data: Data<T>; error: Error }
];

type Task<T> = (...args: unknown[]) => Promise<T | never>;

type Status = "idle" | "pending" | "fulfilled" | "rejected";

type Data<T> = T | null;

type Error = unknown;

type TaskReducer<T> = Reducer<State<Data<T>>, Action<Data<T>>>;

interface State<T> {
  data: T;
  status: Status;
  error: unknown | null;
}

type Action<T> =
  | { type: "pending" }
  | { type: "fulfilled"; payload: T }
  | { type: "rejected"; payload?: unknown };

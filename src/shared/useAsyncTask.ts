import { Reducer, useEffect, useReducer, useRef } from "react";

/**
 * The purpose of this hook is to abstract away reccuring side effects
 * (DRY) such as loading, error handling and retry on failure.
 *
 * @param task An async function
 * @param retryOptions { numOfRetries: number; waitMsBeforeRetry?: number; }
 * @returns [task , { data, status, error }]
 */
export function useAsyncTask<
  Task extends (...args: TaskArgs) => Promise<ReturnTypeAsync<Task>>
>(
  task: Task,
  retryOptions: RetryOptions = { numOfRetries: 0, waitMsBeforeRetry: 0 }
): [
  Task,
  { status: Status; data: ReturnTypeAsync<Task> | null; error: Error | null }
] {
  const [state, dispatch] = useReducer<TaskReducer<ReturnTypeAsync<Task>>>(
    reducer,
    {
      data: null,
      status: "idle",
      error: null,
    }
  );

  const taskRef = useRef((...args: TaskArgs) =>
    doTask(args, retryOptions.numOfRetries, retryOptions.waitMsBeforeRetry)
  );

  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    abortController.current = new AbortController();

    return () => {
      abortController.current?.abort();
    };
  }, []);

  async function doTask(
    args: TaskArgs,
    retries = 0,
    delayMs = 0
  ): Promise<void> {
    dispatch({ type: "pending" });

    try {
      const res = (await task(...args)) as ReturnTypeAsync<Task>;
      if (abortController.current?.signal.aborted) return;
      dispatch({ type: "fulfilled", payload: res });
    } catch (error) {
      if (abortController.current?.signal.aborted) return;

      if (retries > 0) {
        await delay(delayMs);
        return doTask(args, retries - 1, delayMs);
      }

      dispatch({ type: "rejected", payload: error as Error });
    }
  }

  return [taskRef.current as Task, state];
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

type TaskArgs = any[];

type ReturnTypeAsync<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

interface RetryOptions {
  numOfRetries: number;
  waitMsBeforeRetry?: number;
}

type Status = "idle" | "pending" | "fulfilled" | "rejected";

type Data<T> = T | null;

type TaskReducer<T> = Reducer<State<Data<T>>, Action<Data<T>>>;

interface State<T> {
  data: T;
  status: Status;
  error: Error | null;
}

type Action<T> =
  | { type: "pending" }
  | { type: "fulfilled"; payload: T }
  | { type: "rejected"; payload: Error };

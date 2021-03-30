import { Dispatch, Reducer, useReducer } from "react";

// TODO make hook useAsyncTask with input async task (eg fetch)

export function useAsyncProgress<T>(): [State<T | null>, Dispatch<Action<T>>] {
  const [state, dispatch] = useReducer<Reducer<State<T | null>, Action<T>>>(
    reducer,
    { data: null, loading: false, error: null }
  );

  return [state, dispatch];
}

function reducer<T>(state: State<T>, action: Action<T>) {
  switch (action.type) {
    case "pending": {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case "fulfilled": {
      return { ...state, data: action.payload, loading: false, error: null };
    }
    case "rejected": {
      return { ...state, loading: false, error: new Error(action.payload) };
    }
    default:
      throw new Error();
  }
}

export interface State<T> {
  data: T;
  loading: boolean;
  error: null | Error;
}

type Action<T> =
  | { type: "pending" }
  | { type: "fulfilled"; payload: T }
  | { type: "rejected"; payload?: string };

import { useAsyncTask, request } from "shared";
import { useEffect, ReactElement } from "react";

export const FetchContent = <T extends unknown>({
  url,
  children,
}: Props<T>) => {
  const [task, { data, status, error }] = useAsyncTask<T>({ numOfRetries: 2 });

  useEffect(() => {
    task(() => request<T>(url));
  }, [task, url]);

  return (
    children({
      data,
      loading: status === "pending",
      error: error !== null,
    }) ?? null
  );
};

interface Props<T> {
  url: RequestInfo;
  children: RenderProps<T>;
}

type RenderProps<T> = (arg: {
  data: T | null;
  loading: boolean;
  error: boolean;
}) => ReactElement | any;

import { State } from "components/ManageNet/ManageNet.useAsyncProgress";
import { useLazyRequest } from "components/ManageNet/ManageNet.useLazyFetch";
import { useEffect, ReactElement } from "react";

export const FetchContent = <T extends unknown>({
  url,
  children,
}: Props<T>) => {
  const [doFetch, state] = useLazyRequest<T>();

  useEffect(() => {
    doFetch(url);
  }, [doFetch, url]);

  return children(state) ?? null;
};

interface Props<T> {
  url: RequestInfo;
  children: (args1: State<T | null>) => ReactElement | any; // TODO
}

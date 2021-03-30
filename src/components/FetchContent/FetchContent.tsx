import { State } from "components/ManageNet/ManageNet.useAsyncProgress";
import { useLazyRequest } from "components/ManageNet/ManageNet.useLazyFetch";
import { useEffect, ReactElement } from "react";

export const FetchContent = <T extends unknown>({ url, render }: Props<T>) => {
  const [doFetch, state] = useLazyRequest<T>();

  useEffect(() => {
    doFetch(url);
  }, [doFetch, url]);

  return render(state) ?? null;
};

interface Props<T> {
  url: RequestInfo;
  render: (args1: State<T | null>) => ReactElement | any; // TODO
}

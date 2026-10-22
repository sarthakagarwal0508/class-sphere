import { useEffect, useState } from "react";

export default function useFetch(fetcher) {
  const [state, setState] = useState({ data: null, error: null, status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, error: null, status: "ready" });
      })
      .catch((error) => {
        if (!ignore) setState({ data: null, error, status: "error" });
      });

    return () => {
      ignore = true;
    };
  }, [fetcher, reloadKey]);

  const reload = () => {
    setState((s) => ({ ...s, status: "loading" }));
    setReloadKey((k) => k + 1);
  };

  return { ...state, reload };
}

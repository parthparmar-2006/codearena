import { useCallback, useEffect, useState } from 'react';

// Runs an async loader when deps change. Old data stays visible while a reload is in flight.
export function useAsync(load, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true }));
    load().then(
      (data) => active && setState({ data, error: null, loading: false }),
      (error) => active && setState((previous) => ({ ...previous, error, loading: false })),
    );
    return () => {
      active = false;
    };
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}

import { useEffect, useRef } from 'react';

// Calls `callback` every `ms` milliseconds while `ms` is a number; pass null to pause.
export function useInterval(callback, ms) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (ms === null) return undefined;
    const timer = setInterval(() => saved.current(), ms);
    return () => clearInterval(timer);
  }, [ms]);
}

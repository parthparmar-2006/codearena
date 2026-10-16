import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const POLL_MS = 1000;

// Fetches a submission and keeps polling every second until the judge marks it DONE.
export function useSubmission(id) {
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return undefined;
    let active = true;
    let timer;
    setSubmission(null);
    setError(null);

    async function poll() {
      try {
        const latest = await api.getSubmission(id);
        if (!active) return;
        setSubmission(latest);
        if (latest.status !== 'DONE') timer = setTimeout(poll, POLL_MS);
      } catch (err) {
        if (active) setError(err);
      }
    }

    poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [id]);

  return { submission, error };
}

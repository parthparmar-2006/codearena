export const shortId = (id) => id.slice(0, 8);

const UNITS = [
  ['d', 86400],
  ['h', 3600],
  ['m', 60],
];

export function timeAgo(date, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - new Date(date).getTime()) / 1000));
  for (const [unit, size] of UNITS) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${unit} ago`;
  }
  return seconds < 10 ? 'just now' : `${seconds}s ago`;
}

export const formatTime = (ms) => (ms === null || ms === undefined ? '—' : `${ms} ms`);

export const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

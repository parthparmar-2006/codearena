// localStorage can be missing or throw (private mode, blocked storage), so every access is guarded.
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is unavailable; the app keeps working without persistence.
  }
}

const SOLVED_KEY = 'codearena:solved';
const draftKey = (slug) => `codearena:draft:${slug}`;

export const storage = {
  getTheme: () => read('codearena:theme', null),
  setTheme: (theme) => write('codearena:theme', theme),
  getSolved: () => new Set(read(SOLVED_KEY, [])),
  markSolved: (problemId) => write(SOLVED_KEY, [...new Set([...read(SOLVED_KEY, []), problemId])]),
  getDraft: (slug) => read(draftKey(slug), null),
  setDraft: (slug, code) => write(draftKey(slug), code),
};

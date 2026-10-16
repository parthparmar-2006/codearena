export const MAX_CODE_BYTES = 64 * 1024;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = ['QUEUED', 'RUNNING', 'DONE'];
const VERDICTS = ['AC', 'WA', 'TLE', 'RE', 'CE'];

export const isUuid = (value) => UUID_PATTERN.test(value);
export const isPositiveInt = (value) => Number.isInteger(value) && value > 0;
const isCount = (value) => Number.isInteger(value) && value >= 0;
const nullable = (check) => (value) => value === null || check(value);

export function validateNewSubmission(body) {
  const { problemId, language, code } = body ?? {};
  if (!isPositiveInt(problemId)) return 'problemId must be a positive integer';
  if (language !== 'cpp') return 'language must be "cpp"';
  if (typeof code !== 'string' || code.trim() === '') return 'code must be a non-empty string';
  if (Buffer.byteLength(code, 'utf8') > MAX_CODE_BYTES) return 'code must be at most 64 KB';
  return null;
}

const RESULT_FIELDS = {
  status: (value) => STATUSES.includes(value),
  verdict: nullable((value) => VERDICTS.includes(value)),
  passed: isCount,
  total: isCount,
  time_ms: nullable(isCount),
  compile_output: nullable((value) => typeof value === 'string'),
};

export function validateResultUpdate(body) {
  const entries = Object.entries(body ?? {});
  if (entries.length === 0) return 'No fields to update';
  for (const [key, value] of entries) {
    if (!RESULT_FIELDS[key]) return `Unknown field ${key}`;
    if (!RESULT_FIELDS[key](value)) return `Invalid value for ${key}`;
  }
  return null;
}

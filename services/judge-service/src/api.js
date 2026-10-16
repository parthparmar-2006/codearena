export function createApi({ problemServiceUrl, submissionServiceUrl, internalToken }) {
  async function call(url, { method = 'GET', body } = {}) {
    const res = await fetch(url, {
      method,
      headers: { 'X-Internal-Token': internalToken, 'Content-Type': 'application/json' },
      body: body && JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`${method} ${url} failed with status ${res.status}`);
    return res.json();
  }

  return {
    getSubmission: (id) => call(`${submissionServiceUrl}/internal/submissions/${id}`),
    getTestcases: (problemId) => call(`${problemServiceUrl}/internal/problems/${problemId}/testcases`),
    updateSubmission: (id, fields) =>
      call(`${submissionServiceUrl}/internal/submissions/${id}`, { method: 'PATCH', body: fields }),
  };
}

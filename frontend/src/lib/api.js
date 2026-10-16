async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(body.error ?? `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return body;
}

export const api = {
  listProblems: () => request('/api/problems'),
  getProblem: (slug) => request(`/api/problems/${encodeURIComponent(slug)}`),
  submit: (problemId, code) =>
    request('/api/submissions', {
      method: 'POST',
      body: JSON.stringify({ problemId, language: 'cpp', code }),
    }),
  getSubmission: (id) => request(`/api/submissions/${encodeURIComponent(id)}`),
  listSubmissions: ({ problemId, limit = 20 } = {}) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (problemId) params.set('problemId', String(problemId));
    return request(`/api/submissions?${params}`);
  },
};

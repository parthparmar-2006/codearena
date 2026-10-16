function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var ${name}`);
  return value;
}

export const config = {
  healthPort: Number(process.env.HEALTH_PORT ?? 4003),
  jobsDir: process.env.JOBS_DIR ?? '/tmp/jobs',
  redisUrl: required('REDIS_URL'),
  problemServiceUrl: required('PROBLEM_SERVICE_URL'),
  submissionServiceUrl: required('SUBMISSION_SERVICE_URL'),
  internalToken: required('INTERNAL_TOKEN'),
};

CREATE TABLE IF NOT EXISTS submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id     INTEGER NOT NULL,
  language       TEXT NOT NULL CHECK (language IN ('cpp')),
  code           TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'RUNNING', 'DONE')),
  verdict        TEXT CHECK (verdict IN ('AC', 'WA', 'TLE', 'RE', 'CE')),
  passed         INTEGER NOT NULL DEFAULT 0,
  total          INTEGER NOT NULL DEFAULT 0,
  time_ms        INTEGER,
  compile_output TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS submissions_created_at_idx ON submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS submissions_problem_created_idx ON submissions (problem_id, created_at DESC);

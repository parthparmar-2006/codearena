# CodeArena

An online C++ code judge built as microservices. Browse problems, write C++17 in the browser, submit, and get a verdict.

> Work in progress. Full documentation arrives in the final phase.

## Run locally

```bash
cp .env.example .env   # then edit the values
docker compose up --build
```

- Problem service: http://localhost:4001/api/problems
- Submission service: http://localhost:4002/api/submissions

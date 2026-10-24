FROM node:25-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:25-bookworm-slim
# Patch OS packages, install the compiler tools, and remove npm, corepack and yarn (only node is needed).
RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends g++ util-linux tini \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-* \
  && useradd --system --uid 10001 --no-create-home --shell /usr/sbin/nologin judge
ENV NODE_ENV=production HEALTH_PORT=4003 JOBS_DIR=/tmp/jobs
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
USER judge
EXPOSE 4003
HEALTHCHECK --interval=15s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + process.env.HEALTH_PORT + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
# tini runs as PID 1 and reaps orphaned processes left behind by submitted programs.
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "src/index.js"]

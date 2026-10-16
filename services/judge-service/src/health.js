import http from 'node:http';

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function createHealthServer(redis) {
  return http.createServer(async (req, res) => {
    if (req.method !== 'GET' || req.url !== '/health') return send(res, 404, { error: 'Not found' });
    try {
      await redis.ping();
      send(res, 200, { status: 'ok' });
    } catch {
      send(res, 503, { error: 'Redis unavailable' });
    }
  });
}

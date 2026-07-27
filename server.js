'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(body),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin'
  });
  res.end(body);
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  return path.join(ROOT, normalized);
}

const server = http.createServer((req, res) => {
  if (!req.url) return send(res, 400, 'Bad request');

  if (req.url.split('?')[0] === '/health') {
    return send(res, 200, JSON.stringify({ ok: true, app: 'B1 Speaking Lab' }), 'application/json; charset=utf-8');
  }

  let requested = req.url.split('?')[0] === '/' ? '/index.html' : req.url;
  let filePath;
  try {
    filePath = safePath(requested);
  } catch {
    return send(res, 400, 'Bad request');
  }

  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) filePath = path.join(filePath, 'index.html');

    fs.readFile(filePath, (error, data) => {
      if (error) {
        const hasExtension = Boolean(path.extname(requested.split('?')[0]));
        if (!hasExtension) {
          return fs.readFile(path.join(ROOT, 'index.html'), (indexError, indexData) => {
            if (indexError) return send(res, 500, 'Unable to load application');
            res.writeHead(200, {
              'Content-Type': MIME['.html'],
              'Cache-Control': 'no-cache',
              'X-Content-Type-Options': 'nosniff'
            });
            res.end(indexData);
          });
        }
        return send(res, 404, 'Not found');
      }

      const ext = path.extname(filePath).toLowerCase();
      const cacheControl = ['.html', '.js', '.css', '.webmanifest'].includes(ext)
        ? 'no-cache'
        : 'public, max-age=86400';
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Content-Length': data.length,
        'Cache-Control': cacheControl,
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`B1 Speaking Lab is running on http://${HOST}:${PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received, closing server...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

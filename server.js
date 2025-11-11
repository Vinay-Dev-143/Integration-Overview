const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '127.0.0.1';
const port = 5173;
const root = __dirname;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function send(res, status, data, headers={}){
  res.writeHead(status, { 'Cache-Control': 'no-cache', ...headers });
  res.end(data);
}

function serveFile(res, filePath){
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return send(res, 404, 'Not Found');
      return send(res, 500, 'Server Error');
    }
    send(res, 200, data, { 'Content-Type': type });
  });
}

const server = http.createServer((req, res) => {
  // Normalize and prevent path traversal
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let safe = path.normalize(urlPath).replace(/^\/+/, '');
  if (safe === '') safe = 'index.html';
  let filePath = path.join(root, safe);

  // If directory, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Fallback to index.html for unknown paths (SPA-like)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(root, 'index.html');
  }

  serveFile(res, filePath);
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

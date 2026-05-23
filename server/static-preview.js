import { createReadStream, existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { createServer } from 'node:http';

const port = process.env.PREVIEW_PORT || 4173;
const root = resolve('dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url.split('?')[0]);
  const requested = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const filePath = join(root, requested);
  const safePath = existsSync(filePath) ? filePath : join(root, 'index.html');

  response.setHeader('Content-Type', types[extname(safePath)] || 'application/octet-stream');
  createReadStream(safePath).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Preview running at http://127.0.0.1:${port}`);
});

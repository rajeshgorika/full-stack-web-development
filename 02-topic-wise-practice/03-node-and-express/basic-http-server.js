// Topic Practice: Basic HTTP Server using native Node.js 'http' module
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const { url, method } = req;

    res.setHeader('Content-Type', 'application/json');

    if (url === '/' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Hello from Node.js native HTTP server!' }));
    } else if (url === '/api/info' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            runtime: 'Node.js',
            version: process.version,
            platform: process.platform
        }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Native HTTP Server running at http://localhost:${PORT}/`);
});

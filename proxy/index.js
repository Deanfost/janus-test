var httpProxy = require('http-proxy');
var fs = require('fs');
var path = require('path');
var cors = require('cors');

httpProxy.createServer({
    target: 'ws://localhost:8188',
    ws: true,
    ssl: {
        key: fs.readFileSync(path.join('..', 'certs', 'localhost.key')),
        cert: fs.readFileSync(path.join('..', 'certs', 'localhost.crt'))
    }
}).listen(7000);

httpProxy.createProxyServer({
    target: 'http://localhost:8088',
    ssl: {
        key: fs.readFileSync(path.join('..', 'certs', 'localhost.key')),
        cert: fs.readFileSync(path.join('..', 'certs', 'localhost.crt'))
    }
}).listen(7001).on('proxyRes', (proxyRes, req, res) => {
    proxyRes.headers["access-control-allow-origin"] = "*";
    proxyRes.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
});

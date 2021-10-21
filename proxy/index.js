var httpProxy = require('http-proxy');
var fs = require('fs');
var path = require('path');
var cors = require('cors');

const key = fs.readFileSync(path.join('..', 'certs', 'localhost.key'));
const cert = fs.readFileSync(path.join('..', 'certs', 'localhost.crt'));

// Proxy to janus ws api
httpProxy.createServer({
    target: 'ws://localhost:8188',
    ws: true,
    ssl: {
        key, cert
    }
}).listen(7000);

// Proxy to janus http api
httpProxy.createProxyServer({
    target: 'http://localhost:8088',
    ssl: {
        key, cert
    }
}).listen(7001).on('proxyRes', (proxyRes, req, res) => {
    proxyRes.headers["access-control-allow-origin"] = "*";
    proxyRes.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
});

// Proxy to janus admin api
httpProxy.createProxyServer({
    target: 'http://localhost:7088',
    ssl: {
        key, cert
    }
}).listen(7002).on('proxyRes', (proxyRes, req, res) => {
    proxyRes.headers["access-control-allow-origin"] = "*";
    proxyRes.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
});

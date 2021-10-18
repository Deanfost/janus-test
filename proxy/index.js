var httpProxy = require('http-proxy');
var fs = require('fs');
var path = require('path');

httpProxy.createServer({
    target: 'ws://vacillate.cs.umd.edu:8188/janus',
    ws: true,
    ssl: {
        key: fs.readFileSync(path.join('..', 'certs', 'localhost.key')),
        cert: fs.readFileSync(path.join('..', 'certs', 'localhost.crt'))
    }
}).listen(7000);

httpProxy.createProxyServer({
    target: 'http://vacillate.cs.umd.edu:8088/janus',
    ssl: {
        key: fs.readFileSync(path.join('..', 'certs', 'localhost.key')),
        cert: fs.readFileSync(path.join('..', 'certs', 'localhost.crt'))
    }
}).listen(7001);

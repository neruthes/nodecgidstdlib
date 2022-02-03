#!/usr/bin/node

const fs = require('fs');
const http = require('http');
const child_process = require('child_process');

const server = http.createServer(function (req, res) {
    child_process.exec('df -h', function (err, stdout, stderr) {
        if (err) {
            res.writeHead(500);
            res.end('500 Internal Server Error');
        } else {
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
            res.end(stdout);
        }
    });
});

server.listen(0, '127.0.0.1');

server.on('listening', function () {
    const port = server.address().port;
    console.log(`[INFO] Listening port ${port}`);
    fs.writeFileSync(process.env.cgi_portfile, port.toString());
});

#!/usr/bin/node

const fs = require('fs');
const http = require('http');
const child_process = require('child_process');

const commandsList = [
    'rc-status',
    'df -h',
    'lsblk',
    'free -h',
    'ip a'
];

const execCommand = function (cmdline) {
    let output = '';
    try {
        output = child_process.execSync(cmdline).toString();
    } catch (e) {
        output = `(Error)`;
    };
    const tmpl = `=================================
$ ${cmdline}
=================================`;
    return tmpl + '\n\n' + output + '\n\n\n\n';
};

const server = http.createServer(function (req, res) {
    try {
        const output = commandsList.map(execCommand).join('\n');
        res.writeHead(500, {
            'content-type': 'text/plain'
        });
        res.end(output);
    } catch (e) {
        res.writeHead(500);
        res.end('500 Internal Server Error');
    };
});

server.listen(0, '127.0.0.1');

server.on('listening', function () {
    const port = server.address().port;
    console.log(`[INFO] Listening port ${port}`);
    fs.writeFileSync(process.env.cgi_portfile, port.toString());
});

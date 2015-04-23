var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};
// Create a service (the app object is just a callback).
var app = express();

app.get('*', function (req, res) {
    var after = req.url;
    res.writeHead(302, {
      'Location' : 'https://www.example.com' + after
    });
    res.end('You are being redirected.');
});

// Create an HTTP service. (port 8080 is aliased to 80 in iptables)
http.createServer(app).listen(8080);
// Create an HTTPS service identical to the HTTP service (port 4433 is aliased to 443 in iptables)
https.createServer(options, app).listen(4433);

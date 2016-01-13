var restify = require('restify');

var server = restify.createServer();

server.get(/.*/, function (req, res, next) {
    res.send({foo: "baz"});
});

module.exports = server;

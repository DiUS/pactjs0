'use strict';

var express = require('express');
var app = express();

app.get('/resource/1234', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(200, new Buffer(JSON.stringify({ foo: "baz" })));
    //Yes, res.json would be more appropriate, but it keeps appending the
    //Charset and overriding the content-type otherwise.
    //https://github.com/strongloop/express/issues/2238
});

module.exports = app;

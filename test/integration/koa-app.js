var koa = require('koa');
var app = koa();

app.use(function*(next){
    this.set('content-type', 'application/json');
    this.body = new Buffer(JSON.stringify({ foo: "baz"}));
    //Similarly to express, this is a hack to get around the
    //overriding of the content-type to include the charset by Koa
    //https://github.com/strongloop/express/issues/2238
});

module.exports = app;

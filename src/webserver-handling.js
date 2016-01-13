var http = require('http');
var webserver;

function setup(app, cb){
    if(!app){
        throw {
            message: "No webserver defined",
            got: app
        };
    }
    //Express and similar compatible apps have the 'listen' method defined
    else if (!!app.listen){
        webserver = app.listen(3000, cb);
    }
    //it might be koa or else unknown
    else if(app.hasOwnProperty('env')){
            // It appears to be koa:
            // https://github.com/wilmoore/node-supertest-koa-agent
            webserver = http.createServer(app.callback());
            webserver.listen(3000, cb);
    }
    else {
        throw {
            message: "Unable to start app, couldn't identify or start up app",
            app: app
        };
    }
}

function teardown (cb) {
    webserver.close(cb);
}

module.exports = {
    setup: setup,
    teardown: teardown
};

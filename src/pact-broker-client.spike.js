var request = require('request');
var url = require('url');

var _url = 'http://pact-broker/pacts/provider/ConfigService/consumer/ConfigServiceClient/latest';

request.get(_url, {
    headers: {
        "Host": url.parse(_url).hostname,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0",
        "Accept": "text/html",
        "Accept-Language": "en-US,en;q=0.5"
    }
}, function (error, response, body) {
    if(error) {
        throw new Error(error);
    } else {
        console.log(body);
    }
});

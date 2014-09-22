var chai = require("chai");
var expect = chai.expect;

module.exports = function(interaction, response, errors) {

    var actual = response.headers;
    var expected = interaction.response.headers;

    if(typeof expected === 'object') {
        console.log('          includes headers');

        Object.keys(expected).forEach(function (headerKey) {
            var msg = '            "' + headerKey + '" with value "' + expected[headerKey] + '"';
            try {
                expect(actual[headerKey]).to.not.be.null;
                expect(actual[headerKey]).to.eq(expected[headerKey]);
                console.log(msg.green);
            } catch (err) {
                errors.push(err);
                var details = " (" + err.actual + " != " + err.expected + ')';
                console.log(msg.red.bold + details.grey);
            }
        });
    }
};

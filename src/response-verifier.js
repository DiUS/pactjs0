module.exports = (function() {

    var chai = require("chai");
    var expect = chai.expect;
    var util = require('util');

    var verify = function(interaction, response) {
        var errors = [];

        verifiers.forEach(function(verifier) {
            verifier(interaction, response, errors);
        });

        return errors;
    };

    var verifyResponseStatus = function(interaction, response, errors) {
        if (interaction.response.status) {
            var message = "          has a status code " + interaction.response.status;
            try {
                expect(response.statusCode).to.eq(interaction.response.status);
                console.log(message.green);
            } catch (err) {
                console.log(message.red.bold + (" (expected " + err.expected + ", got " + err.actual + ")").grey);
                console.log(err);
                errors.push(err);
            }
        }
    };

    var verifyResponseBody = function(interaction, response, errors) {
        if (interaction.response.body) {
            var message = "          has a matching body";
            try {
                expect(util.inspect(response.body)).to.eq(util.inspect(interaction.response.body));
                console.log(message.green);
            } catch (err) {
                console.log(message.red.bold + (" (expected " + err.expected + ", got " + err.actual + ")").grey);
                errors.push(err);
            }
        }
    };

    var verifiers = [ verifyResponseStatus, verifyResponseBody ];

    return {
        verify: verify,
        verifyResponseStatus: verifyResponseStatus,
        verifyResponseBody: verifyResponseBody
    };
})();
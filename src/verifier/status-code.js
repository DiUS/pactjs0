var chai = require("chai");
var expect = chai.expect;

module.exports = function(interaction, response, errors) {
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

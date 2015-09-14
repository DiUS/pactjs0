var chai = require("chai");
var expect = chai.expect;
var _ = require('congruence');


/**
 * TODO Allow unexpected keys to be sent back in the body. See "Pact Specificaton Philosophy" in main README
 */
module.exports = function(interaction, response, errors) {
    if (interaction.response.body) {
        var message = "          has a matching body";
        try {
            expect(_.similar(interaction.response.body, response.body)).to.equal(true);
            console.log(message.green);
        } catch (err) {
            console.log(message.red.bold + (" (expected " + err.expected + ", got " + err.actual + ")").grey);
            errors.push(err);
        }
    }
};

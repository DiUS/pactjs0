
module.exports = (function() {

    // adds colours to strings
    require('colors');

    // make direct requests on express services
    var request = require('./testing-extensions');

    // assertions libraries
    var chai = require("chai");
    var expect = chai.expect;

    var providerStates, provider, contract;

    /**
     * Verify all interactions within a contract
     *
     * @param pactTest must contain the contract, an instance of the provider, and a map of the initial provider states.
     */
    var verifyInteractions = function(pactTest) {
        contract = pactTest.contract;
        provider = pactTest.provider;
        providerStates = pactTest.providerStates;

        var startTime = Date.now();

        console.log("Verifying a pact between " + contract.consumer.name + " and " + contract.provider.name);

        var pendingInteractions = contract.interactions;
        var completedInteractions = [];

        var passedCount = 0;
        var failedCount = 0;

        var interactionDone = function(errors) {
            completedInteractions.push(nextInteraction);

            if(errors.length === 0) {
                passedCount ++;
            } else {
                failedCount ++;
            }

            if(pendingInteractions.length > 0) {
                nextInteraction = pendingInteractions.shift();
                verifyInteraction(nextInteraction, interactionDone);
            } else {
                var endTime = Date.now();
                var seconds = ((endTime - startTime) / 1000).toFixed(2);
                console.log("---------------------------------------------------------------");
                console.log("Test summary");
                console.log("  " + (""+passedCount).green.bold + " passed, " + (""+failedCount).red.bold + " failed.");
                console.log("  Took " + seconds + " seconds");
                console.log("---------------------------------------------------------------");
            }
        };

        var nextInteraction = pendingInteractions.shift();
        verifyInteraction(nextInteraction, interactionDone);
    };

    var verifyInteraction = function(interaction, done) {

        setupProviderStateForInteraction(interaction);

        console.log("  Given " + interaction.provider_state);
        console.log("    " + interaction.description);
        console.log("      with " + interaction.request.method.toUpperCase() + " " + interaction.request.path);
        console.log("        returns a response which");

        var errors = [];

        try {
            var resp = request(provider.app).get(interaction.request.path).end(function() {

                if (interaction.response.status) {
                    var message = "          has a status code " + interaction.response.status;
                    try {
                        expect(resp.res.statusCode).to.eq(interaction.response.status);
                        console.log(message.green);
                    } catch(err) {
                        console.log(message.red.bold + (" (expected " + err.expected + ", got " + err.actual + ")").grey);
                        errors.push(err);
                    }
                }

                if (interaction.response.body) {
                    var message = "          has a matching body";
                    try {
                        expect(resp.res.body.toString()).to.eq(interaction.response.body.toString());
                        console.log(message.green);
                    } catch(err) {
                        console.log(message.red.bold + (" (expected " + err.expected + ", got " + err.actual + ")").grey);
                        errors.push(err);
                    }
                }

                done(errors);
            });
        } catch(err) {
            errors.push(err);
            done(errors);
        }
    };

    var setupProviderStateForInteraction = function( interaction) {
        providerStates[interaction.provider_state](provider);
    };

    return {
        verify: verifyInteractions
    }
})();


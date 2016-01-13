var log = require('./log')('Pact verifier');
var request = require('request');
var _ = require('lodash');

module.exports = function() {

    // adds colours to strings
    require('colors');

    // pact response verifier
    var verifier = require('./verifier/response');
    var stateManager = require('./provider-state-manager')();
    var webserver = require('./webserver-handling');
    var providerStates, provider, contract;
    var app;
    var httpServer;

    /**
     * Verify all interactions within a contract
     *
     * @param pactTest must contain the contract, an instance of the provider, and a map of the initial provider states.
     * @param done callback function will be passed an array of errors occurring during the verification.
     */
    var verifyInteractions = function(pactTest, done) {

        //Create a copy, because the implemenation mutates the pact data as it goes along
        contract = _.cloneDeep(pactTest.contract);
        app = pactTest.provider;

        providerStates = pactTest.providerStates;

        var startTime = Date.now();

        console.log("Verifying a pact between " + contract.consumer.name + " and " + contract.provider.name);

        var pendingInteractions = contract.interactions;
        var completedInteractions = [];

        var passedCount = 0;
        var failedCount = 0;
        var allErrors = [];

        webserver.setup(pactTest.provider, function(err, server){
            if(err){
                throw {
                    message: "Fatal error: Unable to setup webserver for Pact test",
                    err: err
                };
            }
            else{
                httpServer = server;
                stateManager.verify(contract.interactions, providerStates);
            }
        });

        // synchronously iterate through all interactions
        var interactionDone = function(errors) {
            completedInteractions.push(nextInteraction);

            if(errors.length === 0) {
                passedCount ++;
            } else {
                allErrors = allErrors.concat(errors);
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
                webserver.teardown(function(err){
                    if(err){
                        throw {
                            message: "Unable to teardown webserver",
                            err: err
                        };
                    }
                    else {
                        done(allErrors);
                    }
                });
            }
        };

        var nextInteraction = pendingInteractions.shift();
        verifyInteraction(nextInteraction, interactionDone);
    };

    var verifyInteraction = function(interaction, done) {

        stateManager.setup(provider, interaction, providerStates);

        console.log("  Given " + interaction.provider_state);
        console.log("    " + interaction.description);
        console.log("      with " + interaction.request.method.toUpperCase() + " " + interaction.request.path);
        console.log("        returns a response which");

        var errors = [];

        try {
            var path = (interaction.request.query === undefined) ? interaction.request.path :
                    interaction.request.path + "?" + interaction.request.query;

            var options = {
                url: "http://localhost:3000" + path,
                headers: interaction.request.headers ? interaction.request.headers : {},
                body: interaction.request.body,
                method: interaction.request.method,
                json: true
            };

            request(options, function(err, res, body){
                if(err){
                    console.error('Error in making request: ', options, err);
                    done(err);
                }
                done(verifier.verify(interaction, res));
            });
        }
        catch(err) {
            console.error('caught error in sending request: ', err.stack, err);
            errors.push(err);
            done(errors);
        }
    };

    return {
        verify: verifyInteractions,
        verifyInteraction: verifyInteraction
    };
};

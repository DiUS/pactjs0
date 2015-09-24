var log = require('./log')('Pact verifier');

module.exports = (function() {

    // adds colours to strings
    require('colors');

    // make direct requests on express services
    var request = require('./testing-extensions');

    // pact response verifier
    var verifier = require('./verifier/response');
    var stateManager = require('./provider-state-manager');

    var providerStates, provider, contract;

    /**
     * Verify all interactions within a contract
     *
     * @param pactTest must contain the contract, an instance of the provider, and a map of the initial provider states.
     * @param done callback function will be passed an array of errors occurring during the verification.
     */
    var verifyInteractions = function(pactTest, done) {
        contract = pactTest.contract;
        provider = pactTest.provider;
        providerStates = pactTest.providerStates;

        var startTime = Date.now();

        console.log("Verifying a pact between " + contract.consumer.name + " and " + contract.provider.name);

        var pendingInteractions = contract.interactions;
        var completedInteractions = [];

        var passedCount = 0;
        var failedCount = 0;
        var allErrors = [];

        // before all
        stateManager.verify(contract.interactions, providerStates);

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
                done(allErrors);
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

        if(interaction.request.method === "post"){
          try {
            var resp = request(provider).post(interaction.request.path)
              .send(interaction.request.body)
              .end(function()
            {
              var errors = verifier.verify(interaction, resp.res);
              done(errors);
            });

          } catch(err) {
            errors.push(err);
            done(errors);
          }

        } else if(interaction.request.method === "get"){
          try
          {
            var path = (interaction.request.query === null) ? interaction.request.path :
              interaction.request.path + "?" + interaction.request.query;

            var resp = request(provider).get(path).end(function()
            {
              var errors = verifier.verify(interaction, resp.res);
              done(errors);
            });
          } catch(err) {
            errors.push(err);
            done(errors);
          }
        }


    };

    return {
        verify: verifyInteractions,
        verifyInteraction: verifyInteraction
    }
})();

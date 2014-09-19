require('colors');
var contract = require('../../example/zoo_app-animal_service.json');
var request = require('./test-ext');
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);


var consumer, provider;

/*******************************************************************
 * this is PactJS
 *******************************************************************/

var verifyInteractions = function() {
    var startTime = Date.now();

    console.log("Verifying a pact between " + contract.consumer.name + " and " + contract.provider.name);

    provider = require('../../example/animal_service/app.js');

    pendingInteractions = contract.interactions;
    completedInteractions = [];

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
            console.log("---------------------------------------------------------------")
            console.log("Test summary");
            console.log("  " + (""+passedCount).green.bold + " passed, " + (""+failedCount).red.bold + " failed.");
            console.log("  Took " + seconds + " seconds");
            console.log("---------------------------------------------------------------")
        }
    };

    var nextInteraction = pendingInteractions.shift();
    verifyInteraction(nextInteraction, interactionDone);
};

var verifyInteraction = function(interaction, done) {
    beforeEach();
    setupProviderState(provider, interaction);

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
                try {
                    expect(resp.res.body.toString()).to.eq(interaction.response.body.toString());
                    var message = "          has a matching body";
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

var setupProviderState = function(provider, interaction) {
    providerStates[interaction.provider_state](provider);
};


/*******************************************************************
 * this is provider specific
 *******************************************************************/

var beforeEach = function() {
};

var providerStates = {
    "there is an alligator named Mary":function(provider) {
        provider.db['Mary'] = { name:"mary", species:"alligator", public:true };
    },
    "there is an alligator named Garry":function(provider) {
        provider.db['Garry'] = { name:"mary", species:"alligator", public:false };
    },
    "there is not an alligator named Mary":function(provider) {
        delete provider.db['Mary'];
    },
    "an error occurs retrieving an alligator":function(provider) {
        provider.db.findAnimal = function(name) {
            throw new Error('animal not found');
        };
    }
};

verifyInteractions();
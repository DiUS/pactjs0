var pactTest = {

    contract: require('./zoo_app-animal_service.json'),
    provider: require('../src/app.js'),

    providerStates: {
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
    }
};

var pact = require('../../../src/verify');
pact.verify(pactTest);

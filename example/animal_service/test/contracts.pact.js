var provider = require('../src/app.js');
var app = provider.app;
var animalSvc = provider.animalSvc;

var pactTest = {

    contract: require('./zoo_app-animal_service.json'),
    provider: provider.app,

    providerStates: {
        "there is an alligator named Mary":function(provider) {
            animalSvc['Mary'] = { name:"mary", species:"alligator", public:true };
        },
        "there is an alligator named Garry":function(provider) {
            animalSvc['Garry'] = { name:"mary", species:"alligator", public:false };
        },
        "there is not an alligator named Mary":function(provider) {
            delete animalSvc['Mary'];
        },
        "an error occurs retrieving an alligator":function(provider) {
            animalSvc.findAnimal = function(name) {
                throw new Error('animal not found');
            };
        }
    }
};

var pact = require('../../../src/verify');
pact.verify(pactTest);

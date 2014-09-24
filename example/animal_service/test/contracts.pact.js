var provider = require('../src/app.js');
var app = provider.app;
var animalSvc = provider.animalSvc;

var pactTest = {

    contract: require('./zoo_app-animal_service.json'),
    provider: provider.app,

    providerStates: {
        "there is an alligator named Mary":function() {
            animalSvc['Mary'] = { name:"Mary", species:"Alligator", public:true };
        },
        "there is a private alligator named Garry":function() {
            animalSvc['Garry'] = { name:"Garry", species:"Alligator", public:false };
        },
        "there is not an alligator named Mary":function() {
            delete animalSvc['Mary'];
        },
        "an error occurs retrieving an alligator":function() {
            animalSvc.findAnimal = function(name) {
                throw new Error('Animal not found');
            };
        }
    }
};

var pact = require('../../../src/verify');
pact.verify(pactTest);

var requireHelper = require('../../require_helper');
var chai = require("chai");
var expect = chai.expect;
require('../../../src/testing-extensions');

describe('Response body verifier', function() {

    var verifier = requireHelper('./verifier/body');
    var sample = require('./../sample-pact.json');

    it('should be able to verify the body contains the required data', function(done) {

        // arrange
        var interaction = sample.interactions[0];
        var response = { statusCode:200, body: { name:"Mary" } };
        var errors = [];

        // act
        verifier(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(0);

        done();
    });

    it('should be able to verify the body contains at least required data', function(done) {
        // arrange
        var interaction = sample.interactions[0];
        var response = { statusCode:200, body: { name:"Mary", species:"Alligator", colour:"Browny green" } };
        var errors = [];

        // act
        verifier(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(0);

        done();
    });

    it('should raise an error when the response does not contain the expected data', function(done) {

        // arrange
        var interaction = sample.interactions[0];
        var response = { statusCode:200, body: { name:"Mariann" } };
        var errors = [];

        // act
        verifier(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(1);
        expect(errors[0]).to.deep.eq({ actual: 'Mariann', expected: 'Mary' });

        done();
    });

});

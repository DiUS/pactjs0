var requireHelper = require('../require_helper');
var chai = require("chai");
var expect = chai.expect;

describe('Response status code verifier', function() {

    var verifier = requireHelper('./response-verifier');
    var sample = require('./sample-pact.json');

    it('should be able to verify the response codes match', function(done) {

        // arrange
        var interaction = sample.interactions[0];
        var response = { statusCode:200 };
        var errors = [];

        // act
        verifier.verifyResponseStatus(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(0);

        done();
    });

    it('should add an error when the response codes do not match', function(done) {
        // arrange
        var interaction = sample.interactions[0];
        var response = { statusCode:404 };
        var errors = [];

        // act
        verifier.verifyResponseStatus(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(1);
        expect(errors[0].actual).to.eq(404);
        expect(errors[0].expected).to.eq(200);

        done();
    });
});
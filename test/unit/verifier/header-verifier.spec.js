var requireHelper = require('../../require_helper');
var chai = require("chai");
var expect = chai.expect;

describe('Response header verifier', function() {

    var verifier = requireHelper('./verifier/header');
    var sample = require('./../sample-pact.json');

    it('should be able to verify the response contains a matching header value', function(done) {

        // arrange
        var interaction = sample.interactions[0];
        var response = {
            statusCode:200,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "X-something-else": "123"
            }
        };
        var errors = [];

        // act
        verifier(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(0);

        done();
    });

    it('should add an error when the response contains a header that does not match', function(done) {

        // arrange
        var interaction = sample.interactions[0];
        var response = {
            statusCode:200,
            headers: {
                "Content-Type": "application/xml;charset=utf-8",
                "X-something-else": "123"
            }
        };
        var errors = [];

        // act
        verifier(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(1);
        expect(errors[0].expected).to.eq("application/json;charset=utf-8");
        expect(errors[0].actual).to.eq("application/xml;charset=utf-8");

        done();
    });

    it('should add an error when the response does not contain a required header', function(done) {

        // arrange
        var interaction = sample.interactions[0];
        var response = {
            statusCode:200,
            headers: {
                "X-something-else": "123"
            }
        };
        var errors = [];

        // act
        verifier(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(1);
        expect(errors[0].expected).to.eq("application/json;charset=utf-8");
        expect(errors[0].actual).to.be.undefined;

        done();
    });

    it('should pass when there are no expected headers', function(done) {

        // arrange
        var interaction = sample.interactions[1];
        var response = { statusCode:403 };
        var errors = [];

        // act
        verifier(interaction, response, errors);

        // assert
        expect(errors.length).to.eq(0);

        done();
    });
});
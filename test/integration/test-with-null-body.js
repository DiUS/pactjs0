'use strict';

var expect = require('chai').expect;

describe('When loading a webserver with: ', function(){

    describe('restify', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var app = require('./restify-app');
            var contract = require('./contract.json');

            var providerPact = {
                contract: contract,
                provider: app,
                providerStates: {
                    "there is a resource at /1234": function() {
                        console.log('Running state');
                        state.push(1);
                    }
                }
            };

            pact.verify(providerPact, function(e) {
                errors = e;
                done();
            });
        });

        it('should report no errors and verify the pact', function(){
            expect(errors).to.eql([]);
        });

        it('should run the setup state function', function(){
            expect(state).to.eql([1, 1]);
        });
    });

    describe('express', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var app = require('./express-app');
            var contract = require('./contract.json');

            var providerPact = {
                contract: contract,
                provider: app,
                providerStates: {
                    "there is a resource at /1234": function() {
                        console.log('Running state');
                        state.push(1);
                    }
                }
            };

            pact.verify(providerPact, function(e) {
                errors = e;
                done();
            });
        });

        it('should report no errors and verify the pact', function(){
            expect(errors).to.eql([]);
        });

        it('should run the setup state function', function(){
            expect(state).to.eql([1, 1]);
        });
    });

    describe('Koa', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var contract = require('./contract.json');

            var providerPact = {
                contract: contract,
                provider: require('./koa-app'),
                providerStates: {
                    "there is a resource at /1234": function() {
                        console.log('Running state');
                        state.push(1);
                    }
                }
            };

            pact.verify(providerPact, function(e) {
                errors = e;
                done();
            });
        });

        it('should report no errors and verify the pact with koa', function(){
            expect(errors).to.eql([]);
        });

        it('should run the setup state function', function(){
            expect(state).to.eql([1, 1]);
        });
    });
});


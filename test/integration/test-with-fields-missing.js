'use strict';

var expect = require('chai').expect;

describe('Verify interactions with field missing: ', function(){

    describe('restify - no provider state', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var app = require('./restify-app');
            var contract = require('./contract-no-provider-state.json');

            var providerPact = {
                contract: contract,
                provider: app,
                providerStates: {
                    "there is a resource at /1234": function() {
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

    describe('express - no provider state', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var app = require('./express-app');
            var contract = require('./contract-no-provider-state.json');

            var providerPact = {
                contract: contract,
                provider: app,
                providerStates: {
                    "there is a resource at /1234": function() {
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

    describe('Koa - no provider state', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var contract = require('./contract-no-provider-state.json');

            var providerPact = {
                contract: contract,
                provider: require('./koa-app'),
                providerStates: {
                    "there is a resource at /1234": function() {
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

    describe('restify - no description', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var app = require('./restify-app');
            var contract = require('./contract-no-description.json');

            var providerPact = {
                contract: contract,
                provider: app,
                providerStates: {
                    "there is a resource at /1234": function() {
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

    describe('express - no description', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var app = require('./express-app');
            var contract = require('./contract-no-description.json');

            var providerPact = {
                contract: contract,
                provider: app,
                providerStates: {
                    "there is a resource at /1234": function() {
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

    describe('Koa - no description', function(){

        var errors;
        var state = [];

        beforeEach(function(done){

            var pact = require('../..')();
            var contract = require('./contract-no-description.json');

            var providerPact = {
                contract: contract,
                provider: require('./koa-app'),
                providerStates: {
                    "there is a resource at /1234": function() {
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


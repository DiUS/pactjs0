// make a service request without starting the Express server
var Supertest = require('supertest');
var Test = Supertest.Test;

/**
 * Verify that a JSON document contains a particular attribute
 */
Test.prototype.expectAttr = function(attr, val) {
    this._asserts.push(function(res) {
        return hasAttr(res, attr, val);
    });

    return this;
};

var hasAttr = function(res, attr, expected) {
    var json = asJson(res);
    var actual = json[attr];

    if(!actual) {
        return "response does not have attribute '" + attr + "'";
    } else if(actual !== expected) {
        return "attribute '" + attr + "' does not match expected value (" + expected + " != " + actual + ")";
    }
};

var asJson = function(res) {
    return JSON.parse(res.text);
};


/**
 * Verify that a response is valid JSON
 */
Test.prototype.expectResponseIsJson = function() {
    this._asserts.push(function(res) {
        return isJsonResponse(res);
    });
    return this;
};

var isJsonResponse = function(res) {
    try {
        JSON.parse(res.text);
    } catch(err) {
        return "response is not JSON";
    }
};

/**
 * Mark a unit test as pending
 */
global.pending = function() {
    throw new Error("test is pending");
};

module.exports = Supertest;
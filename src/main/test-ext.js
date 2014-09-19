var Supertest = require('supertest');
var Test = Supertest.Test;

Test.prototype.expectAttr = function(attr, val) {
    this._asserts.push(function(res) {
        return hasAttr(res, attr, val);
    });
    return this;
};

Test.prototype.expectResponseIsJson = function() {
    this._asserts.push(function(res) {
        return isJsonResponse(res);
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

var isJsonResponse = function(res) {
    try {
        JSON.parse(res.text);
    } catch(err) {
        return "response is not JSON";
    }
};

pending = function() {
    throw new Error("test is pending");
};

module.exports = Supertest;
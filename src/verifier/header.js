var chai = require("chai");
var expect = chai.expect;

module.exports = function(interaction, response, errors) {

  var actual = {};
  if(typeof response.headers === 'object') {
    Object.keys(response.headers).forEach(function (headerKey) {
      var lowerCaseHeaderKey = headerKey.toLowerCase();
      actual[lowerCaseHeaderKey] = response.headers[headerKey];
    });
  }

  var expected = {};
  if(typeof interaction.response.headers === 'object') {
    console.log('          includes headers');

    Object.keys(interaction.response.headers).forEach(function (headerKey) {
      var lowerCaseHeaderKey = headerKey.toLowerCase();
      expected[lowerCaseHeaderKey] = interaction.response.headers[headerKey];
    });
  }

  Object.keys(expected).forEach(function (headerKey) {
    var msg = '            "' + headerKey + '" with value "' + expected[headerKey] + '"';
    try {
      expect(actual).to.not.be.null;
      expect(actual[headerKey]).to.eq(expected[headerKey]);
      console.log(msg.green);
    } catch (err) {
      errors.push(err);
      var details = " (" + err.actual + " != " + err.expected + ')';
      console.log(msg.red.bold + details.grey);
    }
  });
};

var deepDiff = require('deep-diff').observableDiff;
/**
 * TODO Allow unexpected keys to be sent back in the body. See "Pact Specificaton Philosophy" in main README
 */
module.exports = function(interaction, response, errors) {
    if (interaction.response.body) {
        var message = "          has a matching body";

      deepDiff(interaction.response.body, response.body, function(diff) {
        if(diff.kind !== 'N') {
          errors.push({actual: diff.rhs, expected: diff.lhs })
        }

      });
      if(errors.length > 0) {
        console.log(message.red + (JSON.stringify(errors)).grey);
      } else {
        console.log(message.green);
      }
    }
};

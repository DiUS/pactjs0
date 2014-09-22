module.exports = (function() {

    var verify = function(interaction, response) {
        var errors = [];

        verifiers.forEach(function(verifier) {
            verifier(interaction, response, errors);
        });

        return errors;
    };

    var verifiers = [
        require('./verifier/body'),
        require('./verifier/status-code'),
        require('./verifier/header')
    ];

    return {
        verify: verify
    };
})();
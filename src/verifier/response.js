module.exports = (function() {

    var verify = function(interaction, response) {
        var errors = [];

        verifiers.forEach(function(verifier) {
            verifier(interaction, response, errors);
        });

        return errors;
    };

    var verifiers = [
        require('./body'),
        require('./status-code'),
        require('./header')
    ];

    return {
        verify: verify
    };
})();
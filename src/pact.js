module.exports = function() {
    return {
        verify: require('./verify')().verify
    };
};

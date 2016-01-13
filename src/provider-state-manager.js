
module.exports = function() {

    var setupProviderStateForInteraction = function(provider, interaction, providerStates) {
        providerStates[interaction.provider_state](provider);
    };

    var verifyProviderStatesForInteractions = function(interactions, providerStates) {
        interactions.forEach(function(interaction) {
            console.log('Interaction', interaction.provider_state)
            if(typeof providerStates[interaction.provider_state] !== 'function') {
                throw new Error("missing provider state '" + interaction.provider_state + "'");
            }
        });
    };

    return {
        setup: setupProviderStateForInteraction,
        verify: verifyProviderStatesForInteractions
    };
};


module.exports = function() {

    var setupProviderStateForInteraction = function(provider, interaction, providerStates) {
        if('provider_state' in interaction
            && typeof(providerStates[interaction.provider_state]) === 'function') {
            providerStates[interaction.provider_state](provider);
        }
        else if('description' in interaction
            && typeof(providerStates[interaction.description]) === 'function') {
            providerStates[interaction.description](provider);
        }
        else {
            throw new Error("missing provider state or description '" + JSON.stringify(interaction) + "'");
        }
    };

    var verifyProviderStatesForInteractions = function(interactions, providerStates) {
        interactions.forEach(function(interaction) {
            console.log('Interaction', interaction.provider_state || interaction.description)
            if(typeof providerStates[interaction.provider_state || interaction.description] !== 'function') {
                throw new Error("missing provider state or description'" + JSON.stringify(interaction) + "'");
            }
        });
    };

    return {
        setup: setupProviderStateForInteraction,
        verify: verifyProviderStatesForInteractions
    };
};

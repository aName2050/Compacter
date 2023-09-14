const {
    Client,
    EmbedBuilder,
    ChannelSelectMenuInteraction,
} = require('discord.js');

module.exports = {
    id: 'settings.channelIgnoreList',
    requiredBotPermissions: [],
    /**
     * @param {ChannelSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const channels = interaction.values;
    },
};

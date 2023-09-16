const {
    Client,
    EmbedBuilder,
    ChannelSelectMenuInteraction,
} = require('discord.js');
const Settings = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'settings.channelIgnoreList',
    requiredBotPermissions: [],
    /**
     * @param {ChannelSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const channels = interaction.values;

        await Settings.findOneAndUpdate(
            { GuildID: interaction.guild.id },
            { IgnoredChannels: { Universal: JSON.stringify(channels) } }
        );

        const embed = new EmbedBuilder()
            .setTitle('Ignored Channels')
            .setDescription(
                `Nothing will be logged for these channels, commands are still available.\n${channels
                    .map(c => `\n* <#${c}>`)
                    .join('')}`
            )
            .setColor(
                require('../../.../../../../config/colors.json')
                    .EMBED_INVIS_SIDEBAR
            );

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

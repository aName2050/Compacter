const {
    StringSelectMenuInteraction,
    Client,
    EmbedBuilder,
} = require('discord.js');
const DB = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'settings.channelMenu',
    /**
     * @param {StringSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.user.id != interaction.guild.ownerId)
            return interaction.reply({
                content: 'You must be the owner of the guild to edit settings',
                ephemeral: true,
            });

        const channel = interaction.values;
        const setting = interaction.message.embeds[0].title;

        const embed = new EmbedBuilder()
            .setTitle(`${setting}`)
            .setColor(
                require('../../../../config/colors.json').EMBED_INVIS_SIDEBAR
            )
            .setDescription(
                `Successfully updated the rules channel.\n\n**New value:** <#${channel}>`
            );

        await DB.findOneAndUpdate(
            { GuildID: interaction.guildId },
            { RulesChannel: channel[0].toString() },
            {
                new: true,
                upsert: true,
            }
        );

        interaction.reply({ content: [embed], ephemeral: true });
    },
};

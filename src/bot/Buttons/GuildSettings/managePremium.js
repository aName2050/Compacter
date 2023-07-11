const {
    ButtonInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
} = require('discord.js');
// const DB = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'manageSubscription',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        if (interaction.user.id != interaction.guild.ownerId)
            return interaction.reply({
                content:
                    'You must be the owner of the server to edit this setting',
                ephemeral: true,
            });

        // const Settings = await DB.findOne({
        //     GuildID: interaction.guildId,
        // });

        interaction.reply({
            content: 'This button (Manage) is currently unvavailable.',
            ephemeral: true,
        });
    },
};

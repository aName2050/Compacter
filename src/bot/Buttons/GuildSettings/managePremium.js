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
            content:
                "This button (Manage) is currently unvavailable and **has been disabled by the developer,** meaning the only way you could've seen this is via hacking, bypassing these restrictions[.](https://tenor.com/view/4k-caught-caught-in4k-caught-in8k-8k-gif-20014426)",
            ephemeral: true,
        });
    },
};

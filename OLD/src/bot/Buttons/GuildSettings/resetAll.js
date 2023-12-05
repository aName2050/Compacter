const { ButtonInteraction, Client } = require('discord.js');
const DB = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'settings.resetAll',
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

        await DB.findOneAndDelete({ GuildID: interaction.guild.id });

        interaction.reply({
            content: 'All settings have been reset',
            ephemeral: true,
        });
    },
};

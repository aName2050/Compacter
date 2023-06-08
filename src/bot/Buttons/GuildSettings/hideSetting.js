const { ButtonInteraction, Client } = require('discord.js');

module.exports = {
    id: 'hideSettingsMenu',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        if (interaction.user.id != interaction.guild.ownerId)
            return interaction.reply({
                content:
                    '```You must be the owner of the server to edit this setting```',
                ephemeral: true,
            });

        await interaction.message.delete();
    },
};

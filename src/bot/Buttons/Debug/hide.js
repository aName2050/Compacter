const { ButtonInteraction, Client } = require('discord.js');

module.exports = {
    id: 'debug-hide',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        await interaction.message.delete();
    },
};

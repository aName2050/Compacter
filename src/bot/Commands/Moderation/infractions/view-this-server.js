const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    subCommand: 'infractions.view-this-server',
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        interaction.reply({
            content: 'this feature is currently unavailable',
            ephemeral: true,
        });
    },
};

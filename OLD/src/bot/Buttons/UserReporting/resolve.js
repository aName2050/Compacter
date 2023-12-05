const {
    ButtonInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

module.exports = {
    id: 'usrreport.resolve',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('usrreport.resolve:disabled')
                .setLabel('Marked as resolved')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
        );
        interaction.reply({
            content: `Incident has been marked as resolved!`,
            ephemeral: true,
        });
        interaction.message.edit({
            content: `This incident has been marked as resolved by <@${interaction.user.id}>`,
            components: [actionRow],
        });
    },
};

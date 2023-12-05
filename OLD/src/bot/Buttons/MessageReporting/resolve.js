const {
    ButtonInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

module.exports = {
    id: 'msgreport.resolve',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('msgreport.del:disabled')
                .setLabel('Delete reported message')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('msgreport.resolve:disabled')
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

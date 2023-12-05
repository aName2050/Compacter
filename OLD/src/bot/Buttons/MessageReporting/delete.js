const {
    ButtonInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

module.exports = {
    id: 'msgreport.del',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const ids = data.split(';');

        const channel = interaction.guild.channels.cache.get(`${ids[0]}`);
        const message = await channel.messages.fetch(`${ids[1]}`);
        await message.delete();

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('msgreport.del:dIsabled')
                .setLabel('Message Deleted')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('msgreport.ignore:dIsabled')
                .setLabel('Mark as resolved')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
        );
        interaction.reply({
            content: `Reported message has been deleted!`,
            ephemeral: true,
        });
        interaction.message.edit({
            content: `The reported message has been deleted by <@${interaction.user.id}>`,
            components: [actionRow],
        });
    },
};

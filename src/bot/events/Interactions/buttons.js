const { ButtonInteraction, Events, Client } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        if (!interaction.isRepliable) return;
        if (!interaction.isButton()) return;

        const data = interaction.customId.split(':')[1];

        const button = client.buttons.get(interaction.customId.split(':')[0]);

        if (!button)
            return interaction.reply({
                content: '```apache\nERROR: button does not exist```',
                ephemeral: true,
            });

        try {
            button.execute(interaction, client, data);
        } catch (e) {
            interaction.reply({
                content: `\`\`\`apache\nERROR: ${error}\`\`\``,
                ephemeral: true,
            });
            console.log(error);
        }
    },
};

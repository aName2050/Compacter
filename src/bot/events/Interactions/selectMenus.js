const { BaseInteraction, Events, Client } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {BaseInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        if (!interaction.isRepliable) return;
        if (!interaction.isAnySelectMenu()) return;

        const selectMenu = client.selectMenus.get(interaction.customId);

        if (!selectMenu)
            return interaction.reply({
                content: '```apache\nERROR: select menu does not exist```',
                ephemeral: true,
            });

        try {
            selectMenu.execute(interaction, client);
        } catch (e) {
            interaction.reply({
                content: `\`\`\`apache\nERROR: ${error}\`\`\``,
                ephemeral: true,
            });
            console.log(error);
        }
    },
};

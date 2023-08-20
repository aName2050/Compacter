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

        if (selectMenu.requiredBotPermissions) {
            const missingPerms = new Array();

            const channelPerms = interaction.guild.channels.cache
                .get(interaction.channel.id)
                .permissionsFor(
                    interaction.guild.roles.botRoleFor(client.user)
                );

            selectMenu.requiredBotPermissions.forEach(p => {
                if (
                    !interaction.guild.roles
                        .botRoleFor(client.user)
                        .permissions.has(p, false) &&
                    !channelPerms.has(p, false)
                ) {
                    missingPerms.push(convertBigIntToPermissionFlag(p));
                }
            });

            // Function to convert the BigInt permission flag to its object notation
            function convertBigIntToPermissionFlag(flag) {
                return Object.keys(PermissionFlagsBits).find(
                    key => PermissionFlagsBits[key] === flag
                );
            }

            if (missingPerms.length > 0)
                return interaction.reply({
                    content: `The bot is missing the following permissions required to run this command:\n- ${missingPerms.join(
                        '\n- '
                    )}`,
                    ephemeral: true,
                });
        }

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

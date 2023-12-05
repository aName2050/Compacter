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

        if (button.requiredBotPermissions) {
            const missingPerms = new Array();

            const channelPerms = interaction.guild.channels.cache
                .get(interaction.channel.id)
                .permissionsFor(
                    interaction.guild.roles.botRoleFor(client.user)
                );

            button.requiredBotPermissions.forEach(p => {
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
                    content: `The bot is missing the following permissions required to execute this button:\n- ${missingPerms.join(
                        '\n- '
                    )}`,
                    ephemeral: true,
                });
        }

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

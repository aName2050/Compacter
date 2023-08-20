const { ModalSubmitInteraction, EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {ModalSubmitInteraction} interaction
     */
    execute(interaction, client) {
        if (interaction.replied) return;
        if (!interaction.isModalSubmit()) return;

        const modal = client.modals.get(interaction.customId.split(':')[0]);

        if (!modal)
            return interaction.reply({
                content: '```apache\nERROR: modal does not exist```',
                ephemeral: true,
            });

        if (modal.requiredBotPermissions) {
            const missingPerms = new Array();

            const channelPerms = interaction.guild.channels.cache
                .get(interaction.channel.id)
                .permissionsFor(
                    interaction.guild.roles.botRoleFor(client.user)
                );

            modal.requiredBotPermissions.forEach(p => {
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
                    content: `The bot is missing the following permissions required to execute this modal:\n- ${missingPerms.join(
                        '\n- '
                    )}`,
                    ephemeral: true,
                });
        }

        try {
            modal.execute(
                interaction,
                client,
                interaction.customId.split(':')[1]
            );
        } catch (e) {
            const errorEmbed = new EmbedBuilder()
                .setDescription(`\`\`\`${e}\`\`\``)
                .setColor(
                    require('../../../../config/colors.json')
                        .EMBED_INVIS_SIDEBAR
                );
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            console.log(e);
        }
    },
};

const {
    CommandInteraction,
    Events,
    Client,
    PermissionFlagsBits,
    PermissionsBitField,
} = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        if (!interaction.isRepliable) return;
        if (
            interaction.isChatInputCommand() ||
            interaction.isContextMenuCommand()
        ) {
            const command = client.commands.get(interaction.commandName);
            if (!command)
                return interaction.reply({
                    content: '```apache\nERROR: command does not exist```',
                    ephemeral: true,
                });

            if (
                (command.developer || command.inDev) &&
                interaction.user.id !== '733422078501322887'
            )
                return interaction.reply({
                    content:
                        '```apache\nERROR: this command is not available for public use```',
                    ephemeral: true,
                });

            if (command.requiredBotPermissions) {
                const missingPerms = new Array();

                const channelPerms = interaction.guild.channels.cache
                    .get(interaction.channel.id)
                    .permissionsFor(
                        interaction.guild.roles.botRoleFor(client.user)
                    );

                command.requiredBotPermissions.forEach(p => {
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

            const subCommand = interaction.options.getSubcommand(false);
            if (subCommand) {
                const subCommandFile = client.subCommands.get(
                    `${interaction.commandName}.${subCommand}`
                );
                if (!subCommandFile)
                    return interaction.reply({
                        content:
                            '```apache\nERROR: subcommand does not exist```',
                        ephemeral: true,
                    });

                subCommandFile.execute(interaction, client);
            } else {
                try {
                    command.execute(interaction, client);
                    // interaction.channel.send({
                    //     content: `<@${interaction.user.id}>\n\`\`\`apache\nNOTICE: hello!\`\`\``,
                    // });
                } catch (error) {
                    interaction.reply({
                        content: `\`\`\`apache\nERROR: ${error}\`\`\``,
                        ephemeral: true,
                    });
                    console.log(error);
                }
            }
        }
    },
};

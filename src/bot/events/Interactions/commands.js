const {
    CommandInteraction,
    Events,
    Client,
    PermissionFlagsBits,
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
                const perms = BigInt(command.requiredBotPermissions.join(''));
                if (
                    !interaction.guild.members.me.permissions.has(perms) ||
                    !interaction.guild.members.me.permissions.has(
                        PermissionFlagsBits.ViewChannel
                    )
                )
                    return interaction.reply({
                        content: `\`\`\`apache\nERROR: The bot is missing the following permissions required to run this command:\n${command.requiredBotPermissions.join(
                            '\n'
                        )}\`\`\``,
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

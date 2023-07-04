const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    developer: false,
    context: false,
    message: false,
    ignoreExecuteCheck: true,
    inDev: true,
    disabled: false,
    requiredBotPermissions: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName('infractions')
        .setDescription('View and manage user infractions')
        .addSubcommand(sub =>
            sub
                .setName('view-all')
                .setDescription('View all infractions recieved by a user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription(
                            'The user you want to view the infractions of'
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('view-this-server')
                .setDescription(
                    'View infractions recieved by a user in this server'
                )
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription(
                            'The user you want to view the infractions of'
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('remove')
                .setDescription(
                    'Remove an infraction recieved in this server by this user'
                )
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription(
                            'The user you want to remove the infraction for'
                        )
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription(
                            'The infraction ID, required to find and delete the infraction'
                        )
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
};

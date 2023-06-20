const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    Events,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    developer: true,
    context: false,
    message: false,
    ignoreExecuteCheck: false,
    inDev: false,
    disabled: false,
    requiredBotPermissions: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName('emit')
        .setDescription('Emit an event')
        .addStringOption(option =>
            option
                .setName('event')
                .setDescription('Select an event to emit')
                .setRequired(true)
                .setChoices(
                    { name: 'guildMemberAdd', value: 'guildMemberAdd' },
                    { name: 'guildMemberRemove', value: 'guildMemberRemove' },
                    { name: 'guildCreate', value: 'guildCreate' },
                    { name: 'guildDelete', value: 'guildDelete' },
                    { name: 'error', value: 'error' }
                )
        )
        .setDMPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        const choice = interaction.options.getString('event');

        switch (choice) {
            case 'guildMemberAdd':
                {
                    client.emit(Events.GuildMemberAdd, interaction.member);
                    reply(interaction);
                }
                break;
            case 'guildMemberRemove':
                {
                    client.emit(Events.GuildMemberRemove, interaction.member);
                    reply(interaction);
                }
                break;

            case 'guildCreate':
                {
                    client.emit(Events.GuildCreate, interaction.guild);
                    reply(interaction);
                }
                break;
            case 'guildDelete':
                {
                    client.emit(Events.GuildDelete, interaction.guild);
                    reply(interaction);
                }
                break;
            case 'error':
                {
                    client.emit(Events.Error, new Error('test error'));
                    process.emitWarning('test warning');
                    Promise.reject(new Error('unhandledRejection test error'));
                    uncaughtExceptionErrorTest();
                    reply(interaction);
                }
                break;
            default:
                interaction.reply({
                    content: 'Invalid option',
                    ephemeral: true,
                });
                break;
        }
    },
};

function reply(interaction) {
    interaction.reply({ content: 'Emitted event', ephemeral: true });
}

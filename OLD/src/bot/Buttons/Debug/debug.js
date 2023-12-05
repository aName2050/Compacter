const {
    ButtonInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
} = require('discord.js');
const {
    ViewChannel,
    KickMembers,
    BanMembers,
    MuteMembers,
    SendMessages,
    AddReactions,
    UseExternalEmojis,
    MentionEveryone,
    ManageMessages,
    ReadMessageHistory,
    UseApplicationCommands,
} = PermissionFlagsBits;

module.exports = {
    id: 'debug-refresh',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const botPerms = interaction.guild.roles.botRoleFor(
            `${client.user.id}`
        ).permissions;
        const channelPerms = interaction.channel.permissionsFor(
            `${client.user.id}`
        );
        const userPerms = interaction.guild.members.cache.get(
            `${interaction.user.id}`
        ).permissions;

        // Required bot perms
        //#region
        const viewChannels = botPerms.has(ViewChannel) ? '✅ |' : '❌ |';
        const kickMembers = botPerms.has(KickMembers) ? '✅ |' : '❌ |';
        const banMembers = botPerms.has(BanMembers) ? '✅ |' : '❌ |';
        const timeoutMembers = botPerms.has(MuteMembers) ? '✅ |' : '❌ |';
        const sendMessages = botPerms.has(SendMessages) ? '✅ |' : '❌ |';
        const addReactions = botPerms.has(AddReactions) ? '✅ |' : '❌ |';
        const useExternalEmojis = botPerms.has(UseExternalEmojis)
            ? '✅ |'
            : '❌ |';
        const mentionAny = botPerms.has(MentionEveryone) ? '✅ |' : '❌ |';
        const manageMessages = botPerms.has(ManageMessages) ? '✅ |' : '❌ |';
        const readMessageHistory = botPerms.has(ReadMessageHistory)
            ? '✅ |'
            : '❌ |';
        //#endregion
        // Required channel perms
        //#region
        const CviewChannels = channelPerms.has(ViewChannel) ? '✅ |' : '❌ |';
        const CsendMessages = channelPerms.has(SendMessages) ? '✅ |' : '❌ |';
        const CaddReactions = channelPerms.has(AddReactions) ? '✅ |' : '❌ |';
        const CuseExternalEmojis = channelPerms.has(UseExternalEmojis)
            ? '✅ |'
            : '❌ |';
        const CmentionAny = channelPerms.has(MentionEveryone) ? '✅ |' : '❌ |';
        const CmanageMessages = channelPerms.has(ManageMessages)
            ? '✅ |'
            : '❌ |';
        const CreadMessageHistory = channelPerms.has(ReadMessageHistory)
            ? '✅ |'
            : '❌ |';
        //#endregion
        // Required user perms
        //#region
        const UviewChannels = userPerms.has(ViewChannel) ? '✅ |' : '❌ |';
        const UsendMessages = userPerms.has(SendMessages) ? '✅ |' : '❌ |';
        const UappCommands = userPerms.has(UseApplicationCommands)
            ? '✅ |'
            : '❌ |';
        //#endregion

        const embed = new EmbedBuilder().setColor('#2f3136').setFields(
            {
                name: 'Bot Permissions',
                value: `
				${viewChannels}  View Channels\n
				${kickMembers}  Kick Members\n
				${banMembers}  Ban Members\n
				${timeoutMembers}  Timeout Members\n
				${sendMessages}  Send Messages\n
				${addReactions}  Add Reactions\n
				${useExternalEmojis}  Use External Emojis\n
				${mentionAny}  Mention Everyone\n
				${manageMessages}  Manage Messages\n
				${readMessageHistory}  Read Message History`,
                inline: true,
            },
            {
                name: 'Channel Permissions',
                value: `
				${CviewChannels}  View Channel\n
				${CsendMessages}  Send Messages\n
				${CaddReactions}  Add Reactions\n
				${CuseExternalEmojis}  Use External Emojis\n
				${CmentionAny}  Mention Everyone\n
				${CmanageMessages}  Manage Messages\n
				${CreadMessageHistory}  Read History`,
                inline: true,
            },
            {
                name: 'User Permissions',
                value: `
				${UviewChannels}  View Channel\n
				${UsendMessages}  Send Messages\n
				${UappCommands}  Use Commands`,
                inline: true,
            },
            { name: '\u200b', value: '\u200b' },
            {
                name: 'More Info',
                value: `User ID:\n\`${interaction.user.id}\`\nChannel ID:\n\`${interaction.channel.id}\`\nGuild ID:\n\`${interaction.guild.id}\`\nAPI Latency:\n\`${client.ws.ping}ms\``,
            }
        );

        await interaction.message.edit({ embeds: [embed] }).catch(e => {
            return interaction.reply({
                content: `\`\`\`${e}\`\`\``,
                ephemeral: true,
            });
        });
        interaction.reply({ content: 'Refreshed', ephemeral: true });
    },
};

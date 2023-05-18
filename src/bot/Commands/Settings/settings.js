const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const guildSettings = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    developer: false,
    context: false,
    message: false,
    ignoreExecuteCheck: false,
    inDev: false,
    disabled: false,
    requiredBotPermissions: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('View and edit settings for your server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const guildID = interaction.guild.id;
        const Settings = await guildSettings.findOne({ GuildID: guildID });

        let channels = {
                msgReport: '*Not set*',
                msgEvent: '*Not set*',
                moderation: '*Not set*',
                memberLogging: {
                    channel: '*Not set*',
                    rules: '*Not set*',
                },
            },
            premium = 'Free';

        if (Settings) {
            channels = {
                msgReport: Settings.ReportChannel
                    ? `<#${Settings.ReportChannel}>`
                    : '*Not set*',
                msgEvent: Settings.MsgEventChannel
                    ? `<#${Settings.MsgEventChannel}>`
                    : '*Not set*',
                moderation: Settings.ModActionChannel
                    ? `<#${Settings.ModActionChannel}>`
                    : '*Not set*',
                memberLogging: {
                    channel: Settings.WelcomeLeaveChannel
                        ? `<#${Settings.WelcomeLeaveChannel}>`
                        : '*Not set*',
                    rules: Settings.Rules
                        ? `<#${Settings.Rules}>`
                        : '*Not set*',
                },
            };
            premium = Settings.premium ? Settings.premium : 'Free';
        }

        const embed = new EmbedBuilder()
            .setTitle('Server Settings')
            .setDescription('View and edit server settings')
            .addFields(
                {
                    name: 'Message Report Logging',
                    value: channels.msgEvent,
                },
                { name: 'Message Event Logging', value: channels.msgEvent },
                {
                    name: 'Moderation Action Logging',
                    value: channels.moderation,
                },
                {
                    name: 'Member Logging',
                    value: channels.memberLogging.channel,
                },
                { name: 'Rules Channel', value: channels.memberLogging.rules },
                { name: 'Premium Tier', value: premium }
            )
            .setColor('#2b2d31')
            .setFooter({
                text: 'Select an option from the dropdown below to edit that setting',
            });

        interaction.reply({ embeds: [embed] });
    },
};

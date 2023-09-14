const {
    ButtonInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
} = require('discord.js');
const DB = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'settings.refresh',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        if (interaction.user.id != interaction.guild.ownerId)
            return interaction.reply({
                content:
                    'You must be the owner of the server to edit this setting',
                ephemeral: true,
            });

        const Settings = await DB.findOne({
            GuildID: interaction.guildId,
        });

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

        let resetDisabled = false;

        if (
            !Settings?.ReportChannel &&
            !Settings?.MsgEventChannel &&
            !Settings?.ModActionChannel &&
            !Settings?.MemberLogChannel &&
            !Settings?.RulesChannel
        )
            resetDisabled = true;

        channels = {
            msgReport: Settings?.ReportChannel
                ? `<#${Settings?.ReportChannel}>`
                : '*Not set*',
            msgEvent: Settings?.MsgEventChannel
                ? `<#${Settings?.MsgEventChannel}>`
                : '*Not set*',
            moderation: Settings?.ModActionChannel
                ? `<#${Settings?.ModActionChannel}>`
                : '*Not set*',
            memberLogging: {
                channel: Settings?.MemberLogChannel
                    ? `<#${Settings?.MemberLogChannel}>`
                    : '*Not set*',
                rules: Settings?.RulesChannel
                    ? `<#${Settings.RulesChannel}>`
                    : '*Not set*',
            },
        };
        premium = Settings?.premium ? Settings.premium : 'Free';

        const embed = new EmbedBuilder()
            .setTitle('Server Settings')
            .setDescription('View and edit server settings')
            .addFields(
                {
                    name: 'Report Logging',
                    value: channels.msgReport,
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
                {
                    name: 'Ignored Channels',
                    value: `${
                        JSON.parse(Settings.IgnoredChannels.Universal).length
                    } ignored\nOpen this setting to view more`,
                },
                { name: 'Premium Tier', value: premium }
            )
            .setColor(
                require('../../../../config/colors.json').EMBED_INVIS_SIDEBAR
            )
            .setFooter({
                text: 'Select an option from the dropdown below to edit that setting',
            });

        const actionRow = new ActionRowBuilder().setComponents(
            new StringSelectMenuBuilder()
                .setCustomId('settings.selectSetting')
                .setPlaceholder('No setting selected')
                .setMinValues(1)
                .setMaxValues(1)
                .setOptions(
                    {
                        label: 'Report Logging',
                        description:
                            'The channel where reported messages will be sent to',
                        value: 'settings.msgreport.0',
                    },
                    {
                        label: 'Message Event Logging',
                        description:
                            'The channel where message logs will be sent',
                        value: 'settings.msgevent.1',
                    },
                    {
                        label: 'Moderation Logging',
                        description:
                            'The channel where moderation logs are sent to',
                        value: 'settings.modactions.2',
                    },
                    {
                        label: 'Member Logging',
                        description:
                            'The channel where member logs (join/leave) are sent to',
                        value: 'settings.memberlog.3',
                    },
                    {
                        label: 'Ignored Channels',
                        description:
                            'A list of channels that the bot will log nothing for',
                        value: 'settings.ignoredChannels.4',
                    },
                    {
                        label: 'Compacter Premium',
                        description:
                            'Manage your Compacter Premium subscription',
                        value: 'settings.premium.5',
                    }
                )
        );
        const actionRow2 = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId('settings.resetAll')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Reset all settings')
                .setDisabled(resetDisabled),
            new ButtonBuilder()
                .setCustomId('settings.hideMenu')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Hide settings menu'),
            new ButtonBuilder()
                .setCustomId('settings.refresh')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Refresh')
        );

        interaction.message.edit({
            embeds: [embed],
            components: [actionRow, actionRow2],
        });
        interaction.reply({
            content: 'Settings menu refreshed',
            ephemeral: true,
        });
    },
};

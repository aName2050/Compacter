const {
    ButtonInteraction,
    Client,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    EmbedBuilder,
    ChannelType,
} = require('discord.js');
const DB = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'refreshSettingsMenu',
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

        const setting = interaction.message.embeds[0].title;

        const embed = new EmbedBuilder()
            .setTitle(`${setting}`)
            .setColor(
                require('../../../../config/colors.json').EMBED_INVIS_SIDEBAR
            );
        const actionRow1 = new ActionRowBuilder().setComponents(
            new ChannelSelectMenuBuilder()
                .addChannelTypes(ChannelType.GuildText)
                .setPlaceholder('Select a channel to log to')
                .setCustomId('settings.channelMenu')
        );
        const actionRow2 = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId(`resetSetting:${setting}`)
                .setStyle(ButtonStyle.Danger)
                .setLabel('Reset')
        );
        const actionRow3 = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId('manageSubscription')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Manage Subscription')
                .setDisabled(true),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Open in your web browser')
                .setURL(
                    `https://compacter.gg/guilds/${interaction.guildId}/manage/premium`
                )
                .setDisabled(true)
        );
        const actionRow4 = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId(`refreshSettingsMenu:${setting}`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Refresh this setting'),
            new ButtonBuilder()
                .setCustomId('hideSettingsMenu')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Hide this menu')
        );
        const actionRow5 = new ActionRowBuilder().setComponents(
            new ChannelSelectMenuBuilder()
                .setChannelTypes(ChannelType.GuildText)
                .setPlaceholder('Select a rules channel')
                .setCustomId('settings.rulesChannelMenu')
        );

        const channelEditComponents = [actionRow1, actionRow2];
        const memberLogEditComponets = [actionRow1, actionRow5, actionRow2];
        const premiumManageComponets = [actionRow3];
        const genericComponets = [actionRow4];
        let components = [];

        switch (setting) {
            case 'Message Report Logging':
                {
                    embed.setDescription(
                        `${channels.msgReport}\n\nSet the channel for user reports to be logged to.`
                    );
                    components = channelEditComponents;
                }
                break;
            case 'Message Event Logging':
                {
                    embed.setDescription(
                        `${channels.msgEvent}\n\nSet the channel for message events (delete, edit, etc.) to be logged to.`
                    );
                    components = channelEditComponents;
                }
                break;
            case 'Moderation Logging':
                {
                    embed.setDescription(
                        `${channels.moderation}\n\nSet the channel you would like to use to log moderation related actions.`
                    );
                    components = channelEditComponents;
                }
                break;
            case 'Member Logging':
                {
                    embed.setDescription(
                        `Log channel: ${channels.memberLogging.channel}\nRules channel: ${channels.memberLogging.rules}\n\nSet the channel for member logs and the server rules channel.`
                    );
                    components = memberLogEditComponets;
                }
                break;
            case 'Compacter Premium':
                {
                    embed.setDescription(
                        `Premium Tier: ${premium}\n\nManage your Compacter Premium subscription\n\n*Currently unavailable*`
                    );
                    components = premiumManageComponets;
                }
                break;
            default:
                embed.setDescription(
                    'A problem occured while fetching this setting: unknown setting'
                );
                break;
        }
        components.push(genericComponets[0]);
        interaction.message.edit({ embeds: [embed], components: components });
        interaction.reply({ content: 'Menu refreshed', ephemeral: true });
    },
};

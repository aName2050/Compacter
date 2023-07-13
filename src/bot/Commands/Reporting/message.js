const {
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    ApplicationCommandType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const GuildSettings = require('../../../private/mongodb/guildSettings.js');
const colors = require('../../../../config/colors.json');

module.exports = {
    developer: false,
    context: false,
    message: true,
    ignoreExecuteCheck: false,
    inDev: true,
    disabled: false,
    requiredBotPermissions: [PermissionFlagsBits.SendMessages],
    data: new ContextMenuCommandBuilder()
        .setType(ApplicationCommandType.Message)
        .setName('Report Message')
        .setDMPermission(false),
    /**
     *
     * @param {MessageContextMenuCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild } = interaction;
        const msg = interaction.targetMessage;

        const settings = await GuildSettings.findOne({ GuildID: guild.id });
        const logChannel = settings?.ReportChannel;

        if (!logChannel || !logChannel === '')
            return interaction.reply({
                content:
                    'Unable to report this message to moderators, message reporting is disabled in this server.',
                ephemeral: true,
            });

        // if (msg.author.id === interaction.user.id)
        //     return interaction.reply({
        //         content: "You can't report your own message!",
        //         ephemeral: true,
        //     });

        interaction.reply({
            content: 'Message reported! If this was a mistake, DM a moderator',
            ephemeral: true,
        });

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`msgreport.del:${msg.channel.id};${msg.id}`)
                .setLabel('Delete reported message')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('msgreport.resolve')
                .setLabel('Mark as resolved')
                .setStyle(ButtonStyle.Secondary)
        );

        const postReportEmbed = new EmbedBuilder()
            .setTimestamp()
            .setAuthor({
                name: `${msg.author.username}`,
                iconURL: `${msg.author.avatarURL({
                    size: 512,
                    forceStatic: false,
                })}`,
            })
            .setDescription(
                `
                Reported Message Author: <@${msg.author.id}>
                Message reported by <@${interaction.user.id}> - **[Go to message](${msg.url})**\n\nTo moderate this user, click/tap their tagged name, then right-click/tap **Apps**, then click/tap **Take Moderation Action**`
            )
            .setColor(colors.EMBED_INVIS_SIDEBAR);
        const reportedMsg = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('Reported Message')
            .setDescription(
                `${
                    msg.content.length > 4050
                        ? msg.content.slice(0, 4047) + '...'
                        : msg.content
                }`
            );

        const reportChannel = guild.channels.cache.get(`${logChannel}`);
        reportChannel.send({
            embeds: [postReportEmbed, reportedMsg],
            components: [actionRow],
        });

        // DM response
        const actionRowDM = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(msg.url)
                .setLabel('View Reported Message')
        );
        const DMembed1 = new EmbedBuilder()
            .setAuthor({
                name: `Hey there ${interaction.user.username}, here's the message you reported`,
            })
            .setDescription(`If this was a mistake, contact a moderator`)
            .setColor('#2f3136');
        const DMembed2 = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Reported Message')
            .setDescription(
                `${
                    msg.content.length > 4050
                        ? msg.content.slice(0, 4047) + '...'
                        : msg.content ||
                          '`❌ Unable to retrieve message content`'
                }`
            );

        interaction.user.send({
            embeds: [DMembed1, DMembed2],
            components: [actionRowDM],
        });
    },
};

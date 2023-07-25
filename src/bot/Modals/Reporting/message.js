const {
    Client,
    EmbedBuilder,
    ModalSubmitInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const GuildSettings = require('../../../private/mongodb/guildSettings.js');
const colors = require('../../../../config/colors.json');

module.exports = {
    id: 'msgreport',
    requiredBotPermissions: [],
    /**
     *
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction, client, data) {
        const { guild } = interaction;
        const messages = interaction.guild.channels.cache.get(
            `${data.split(';')[1]}`
        );
        const msg = messages.messages.cache.get(`${data.split(';')[0]}`);

        const reason = interaction.fields.getTextInputValue('msgreport.reason');

        const settings = await GuildSettings.findOne({ GuildID: guild.id });
        const logChannel = settings?.ReportChannel;

        interaction.reply({
            content:
                'Message reported! If this was a mistake, contact a moderator',
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
                Message reported by <@${interaction.user.id}> - **[Go to message](${msg.url})**\n\nReported Message Author: <@${msg.author.id}>\n\nTo moderate this user, click/tap their tagged name, then right-click/tap **Apps**, then click/tap **Take Moderation Action**
                `
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

        const reasonEmbed = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('Reason')
            .setDescription(`${reason}`);

        const reportChannel = guild.channels.cache.get(`${logChannel}`);
        reportChannel.send({
            embeds: [postReportEmbed, reportedMsg, reasonEmbed],
            components: [actionRow],
        });

        // DM response
        const actionRowDM = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId('info[DISABLED]')
                .setLabel(`From: ${guild.name}`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary),
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
            .setColor(colors.EMBED_INVIS_SIDEBAR);
        const DMembed2 = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('Reported Message')
            .setDescription(
                `${
                    msg.content.length > 4050
                        ? msg.content.slice(0, 4047) + '...'
                        : msg.content ||
                          '`❌ Unable to retrieve message content`'
                }`
            );
        const DMembed3 = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('The reason you provided was...')
            .setDescription(`${reason}`);

        interaction.user.send({
            embeds: [DMembed1, DMembed2, DMembed3],
            components: [actionRowDM],
        });
    },
};

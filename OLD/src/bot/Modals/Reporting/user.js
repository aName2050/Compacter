const {
    Client,
    EmbedBuilder,
    ModalSubmitInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const colors = require('../../../../config/colors.json');
const GuildSettings = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'usrreport',
    requiredBotPermissions: [],
    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const user = interaction.guild.members.cache.get(`${data}`).user;

        const { guild } = interaction;

        const settings = await GuildSettings.findOne({ GuildID: guild.id });
        const logChannel = settings?.ReportChannel;

        const reason = interaction.fields.getTextInputValue('usrreport.reason');

        interaction.reply({
            content:
                'User reported! If this was a mistake, contact a moderator',
            ephemeral: true,
        });

        const postReportEmbed = new EmbedBuilder()
            .setTimestamp()
            .setAuthor({
                name: `${user.username}`,
                iconURL: `${user.avatarURL({
                    size: 512,
                    forceStatic: false,
                })}`,
            })
            .setDescription(
                `
                <@${user.id}> has been reported by <@${interaction.user.id}>\n\n
                To moderate this user, click/tap their tagged name, then right-click/tap **Apps**, then click/tap **Take Moderation Action**
                `
            )
            .setColor(colors.EMBED_INVIS_SIDEBAR);
        const reasonEmbed = new EmbedBuilder()
            .setTitle('Reason')
            .setDescription(`${reason}`)
            .setColor(colors.EMBED_INVIS_SIDEBAR);

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('usrreport.resolve')
                .setLabel('Mark as resolved')
                .setStyle(ButtonStyle.Primary)
        );

        const reportChannel = guild.channels.cache.get(`${logChannel}`);
        reportChannel.send({
            embeds: [postReportEmbed, reasonEmbed],
            components: [actionRow],
        });
        const DMembed1 = new EmbedBuilder()
            .setAuthor({
                name: `Hey there ${interaction.user.username}, you just reported ${user.username}`,
            })
            .setDescription(`If this was a mistake, contact a moderator`)
            .setColor(colors.EMBED_INVIS_SIDEBAR);
        const DMembed2 = new EmbedBuilder()
            .setTitle('You reported this user with the reason of...')
            .setDescription(`${reason}`)
            .setColor(colors.EMBED_INVIS_SIDEBAR);

        const buttonLabel = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId('info[DISABLED]')
                .setLabel(`From: ${guild.name}`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)
        );

        interaction.user.send({
            embeds: [DMembed1, DMembed2],
            components: [buttonLabel],
        });
    },
};

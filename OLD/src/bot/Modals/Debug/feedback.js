const {
    Client,
    EmbedBuilder,
    ModalSubmitInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    AttachmentBuilder,
    WebhookClient,
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
const colors = require('../../../../config/colors.json');
const { FEEDBACK_URL } = require('../../../../config/bot.json').SUPPORT;

module.exports = {
    id: 'debug.report.prompt',
    requiredBotPermissions: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ViewChannel,
    ],
    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const webhook = new WebhookClient({
            url: require('../../../../config/bot.json').SUPPORT.FEEDBACK_URL,
        });

        const feedback = interaction.fields.getTextInputValue(
            'debug.report.feedback'
        );
        const consent = interaction.fields
            .getTextInputValue('debug.report.consent')
            .toLowerCase();
        const userGaveConsent = consent == 'yes' ? true : false;

        const feedbackEmbed = new EmbedBuilder()
            .setAuthor({
                name: `New feedback from @${interaction.user.username}`,
                iconURL: `${interaction.user.avatarURL()}`,
            })
            .setDescription(feedback)
            .setColor(colors.EMBED_INVIS_SIDEBAR);

        if (userGaveConsent) {
            const botPerms = interaction.guild.roles.botRoleFor(
                client.user
            ).permissions;
            const channelPerms = interaction.channel.permissionsFor(
                interaction.user,
                false
            );
            const userPerms = interaction.member.permissions;
            // Required bot perms
            //#region
            const viewChannels =
                'BOT.ViewChannel:' +
                (botPerms.has(ViewChannel) ? 'true' : 'false');
            const kickMembers =
                'BOT.KickMembers:' +
                (botPerms.has(KickMembers) ? 'true' : 'false');
            const banMembers =
                'BOT.BanMembers:' +
                (botPerms.has(BanMembers) ? 'true' : 'false');
            const timeoutMembers =
                'BOT.MuteMembers:' +
                (botPerms.has(MuteMembers) ? 'true' : 'false');
            const sendMessages =
                'BOT.SendMessages:' +
                (botPerms.has(SendMessages) ? 'true' : 'false');
            const addReactions =
                'BOT.AddReactions:' +
                (botPerms.has(AddReactions) ? 'true' : 'false');
            const useExternalEmojis =
                'BOT.UseExternalEmojis:' +
                (botPerms.has(UseExternalEmojis) ? 'true' : 'false');
            const mentionAny =
                'BOT.MentionEveryone:' +
                (botPerms.has(MentionEveryone) ? 'true' : 'false');
            const manageMessages =
                'BOT.ManageMessages:' +
                (botPerms.has(ManageMessages) ? 'true' : 'false');
            const readMessageHistory =
                'BOT.ReadMessageHistory:' +
                (botPerms.has(ReadMessageHistory) ? 'true' : 'false');
            //#endregion
            // Required channel perms
            //#region
            const CviewChannels =
                'USRCHNL.ViewChannel:' +
                (channelPerms.has(ViewChannel) ? 'true' : 'false');
            const CsendMessages =
                'USRCHNL.SendMessages:' +
                (channelPerms.has(SendMessages) ? 'true' : 'false');
            const CaddReactions =
                'USRCHNL.AddReactions:' +
                (channelPerms.has(AddReactions) ? 'true' : 'false');
            const CuseExternalEmojis =
                'USRCHNL.UseExternalEmojis:' +
                (channelPerms.has(UseExternalEmojis) ? 'true' : 'false');
            const CmentionAny =
                'USRCHNL.MentionEveryone:' +
                (channelPerms.has(MentionEveryone) ? 'true' : 'false');
            const CmanageMessages =
                'USRCHNL.ManageMessages:' +
                (channelPerms.has(ManageMessages) ? 'true' : 'false');
            const CreadMessageHistory =
                'USRCHNL.ReadMessageHistory:' +
                (channelPerms.has(ReadMessageHistory) ? 'true' : 'false');
            //#endregion
            // Required user perms
            //#region
            const UviewChannels =
                'USR.ViewChannel:' +
                (userPerms.has(ViewChannel) ? 'true' : 'false');
            const UsendMessages =
                'USR.SendMessages:' +
                (userPerms.has(SendMessages) ? 'true' : 'false');
            const UappCommands =
                'USR.UseApplicationCommands:' +
                (userPerms.has(UseApplicationCommands) ? 'true' : 'false');
            //#endregion
            const data = [
                viewChannels,
                kickMembers,
                banMembers,
                timeoutMembers,
                sendMessages,
                addReactions,
                useExternalEmojis,
                mentionAny,
                manageMessages,
                readMessageHistory,
                CviewChannels,
                CsendMessages,
                CaddReactions,
                CuseExternalEmojis,
                CmentionAny,
                CmanageMessages,
                CreadMessageHistory,
                UviewChannels,
                UsendMessages,
                UappCommands,
                '\n',
                `USR.ID:${interaction.user.id}`,
                `CHNL.ID:${interaction.channel.id}`,
                `GUILD.ID:${interaction.guild.id}`,
                `API_LATENCY:${client.ws.ping}ms`,
                `GATEWAY_LATENCY:${
                    Date.now() - interaction.createdTimestamp
                }ms`,
            ].join('\n');
            const attachment = new AttachmentBuilder(
                Buffer.from(data, 'utf-8'),
                { name: `${Date.now()}-DIAGNOSTIC_DATA.txt` }
            );
            feedbackEmbed.setFooter({
                text: '!! This user has chosen to opt-in to sharing diagnostic data !!',
            });
            webhook.send({ embeds: [feedbackEmbed], files: [attachment] });

            interaction.user
                .send({
                    content: `Hey <@${interaction.user.id}>, here's a copy of the diagnostic data submitted.`,
                    files: [attachment],
                })
                .then(dm =>
                    interaction.reply({
                        content: `Submitted feedback! *A copy of the diagnostic data has been sent to your **[DMs](<https://discord.com/channels/@me/${dm.channel.id}>)***`,
                        ephemeral: true,
                    })
                );
        } else {
            feedbackEmbed.setFooter({
                text: '!! This user has chosen to opt-out to sharing diagnostic data !!',
            });
            webhook.send({ embeds: [feedbackEmbed] });
            interaction.reply({
                content: 'Submitted feedback!',
                ephemeral: true,
            });
        }
    },
};

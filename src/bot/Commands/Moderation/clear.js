const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const DiscordTranscripts = require('discord-html-transcripts');
const guildSettings = require('../../../private/mongodb/guildSettings.js');
const colors = require('../../../../config/colors.json');

module.exports = {
    developer: false,
    context: false,
    message: false,
    ignoreExecuteCheck: false,
    inDev: false,
    disabled: false,
    requiredBotPermissions: [
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.SendMessages,
    ],
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages in a channel or from a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addNumberOption(option =>
            option
                .setName('amount')
                .setDescription('The amount of messages to delete')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for clearing these messages')
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Clear messages sent by this user only')
                .setRequired(false)
        )
        .setDMPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const Amount = interaction.options.getNumber('amount');
        const Reason = interaction.options.getString('reason');
        const User = interaction.options.getUser('user');

        const channelMessages = await interaction.channel.messages.fetch();

        const settings = await guildSettings.findOne({
            GuildID: interaction.guild.id,
        });
        const logChannel = interaction.guild.channels.cache.get(
            settings.ModActionChannel
        );

        const embed = new EmbedBuilder().setColor(colors.EMBED_INVIS_SIDEBAR);
        const log = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('Messags Cleared')
            .setFooter({
                text: 'You need to download the transcript to view it',
            })
            .setThumbnail();

        let logDesc = [
            `Messages cleared by ${interaction.member}`,
            `Channel: ${interaction.channel}`,
            `User: ${User || 'N/A'}`,
            `Reason: ${Reason}`,
        ];

        if (User) {
            let i = 0;
            let messages = [];
            channelMessages.filter(msg => {
                if (msg.author.id === User.id && Amount > i) {
                    messages.push(msg);
                    i++;
                }
            });

            const transcript = await DiscordTranscripts.generateFromMessages(
                messages,
                interaction.channel
            );

            interaction.channel.bulkDelete(messages, true).then(messages => {
                interaction.reply({
                    embeds: [
                        embed.setDescription(
                            `Cleared \`${messages.size}\` message(s) from ${User}`
                        ),
                    ],
                    ephemeral: true,
                });
                logDesc.push(`Messages Cleared: ${messages.size}`);
                logDesc.push('**Transcript attached above**');
                logChannel?.send({
                    embeds: [log.setDescription(logDesc.join('\n'))],
                    files: [transcript],
                });
            });
        } else {
            const transcript = await DiscordTranscripts.createTranscript(
                interaction.channel,
                { limit: Amount }
            );

            interaction.channel.bulkDelete(Amount, true).then(messages => {
                interaction.reply({
                    embeds: [
                        embed.setDescription(
                            `Cleared \`${messages.size}\` message(s)`
                        ),
                    ],
                    ephemeral: true,
                });
                logDesc.push(`Messages Cleared: ${messages.size}`);
                logDesc.push('**Transcript attached above**');
                logChannel?.send({
                    embeds: [log.setDescription(logDesc.join('\n'))],
                    files: [transcript],
                });
            });
        }
    },
};

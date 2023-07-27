const {
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    ApplicationCommandType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');
const GuildSettings = require('../../../private/mongodb/guildSettings.js');
const colors = require('../../../../config/colors.json');

module.exports = {
    developer: false,
    context: false,
    message: true,
    ignoreExecuteCheck: false,
    inDev: false,
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
                    'Unable to report this message to moderators, reporting is disabled in this server.',
                ephemeral: true,
            });

        if (msg.author.id !== interaction.user.id)
            return interaction.reply({
                content: "You can't report your own message!",
                ephemeral: true,
            });

        const reasonTextfield = new ActionRowBuilder().setComponents(
            new TextInputBuilder()
                .setCustomId('msgreport.reason')
                .setPlaceholder(`Enter a reason...`)
                .setLabel('Why are you reporting this message?')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(1000)
                .setRequired(true)
        );
        const modal = new ModalBuilder()
            .setTitle('Message Reporting')
            .setCustomId(`msgreport:${msg.id};${msg.channel.id}`)
            .setComponents(reasonTextfield);

        await interaction.showModal(modal);
    },
};

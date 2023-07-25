const {
    UserContextMenuCommandInteraction,
    EmbedBuilder,
    ContextMenuCommandBuilder,
    PermissionFlagsBits,
    ApplicationCommandType,
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
    context: true,
    data: new ContextMenuCommandBuilder()
        .setName('Report User')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     *
     * @param {UserContextMenuCommandInteraction} interaction
     */
    async execute(interaction) {
        const user = interaction.targetUser;
        const { guild } = interaction;

        const settings = await GuildSettings.findOne({ GuildID: guild.id });
        const logChannel = settings?.ReportChannel;

        if (!logChannel || !logChannel === '')
            return interaction.reply({
                content:
                    'Unable to report this user to moderators, reporting is disabled in this server.',
                ephemeral: true,
            });

        if (user.id == interaction.user.id)
            return interaction.reply({
                content: "You can't report yourself!",
                ephemeral: true,
            });

        const reasonTextfield = new ActionRowBuilder().setComponents(
            new TextInputBuilder()
                .setCustomId('usrreport.reason')
                .setPlaceholder(`Enter a reason...`)
                .setLabel(`Why are you reporting this user?`)
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(1000)
                .setRequired(true)
        );
        const modal = new ModalBuilder()
            .setTitle('User Reporting')
            .setCustomId(`usrreport:${user.id}`)
            .setComponents(reasonTextfield);

        await interaction.showModal(modal);
    },
};

const {
    ButtonInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');

module.exports = {
    id: 'debug-report',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const feedback = new ActionRowBuilder().setComponents(
            new TextInputBuilder()
                .setCustomId('debug.report.feedback')
                .setMinLength(20)
                .setMaxLength(1000)
                .setLabel('Give some feedback for Compacter!')
                .setPlaceholder('Write some feedback here...')
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
        );
        const consent = new ActionRowBuilder().setComponents(
            new TextInputBuilder()
                .setCustomId('debug.report.consent')
                .setMinLength(2)
                .setMaxLength(3)
                .setLabel('Share diagnostic data? (YES/NO)')
                .setPlaceholder('YES or NO')
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
        );

        const prompt = new ModalBuilder()
            .setTitle('Feedback')
            .setCustomId('debug.report.prompt')
            .setComponents(feedback, consent);

        await interaction.showModal(prompt);
    },
};

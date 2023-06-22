const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const axios = require('axios').default;

module.exports = {
    developer: false,
    context: false,
    message: false,
    ignoreExecuteCheck: false,
    inDev: false,
    disabled: false,
    requiredBotPermissions: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName('advice')
        .setDescription('Get some life advice')
        .setDMPermission(true),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        axios
            .get('https://api.adviceslip.com/advice')
            .then(res => {
                interaction.reply({ content: res.data.slip.advice });
            })
            .catch(e => {
                interaction.reply({
                    content: `\`\`\`apache\nERROR: ${e}\`\`\``,
                    ephemeral: true,
                });
            });
    },
};

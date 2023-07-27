const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    Client,
} = require('discord.js');

module.exports = {
    developer: false,
    context: false,
    message: false,
    ignoreExecuteCheck: false,
    inDev: true,
    disabled: false,
    requiredBotPermissions: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pings the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .setDescription(
                `API Latency: **${client.ws.ping}ms**\nGateway Latency: **${
                    Date.now() - interaction.createdTimestamp
                }ms**`
            )
            .setColor(
                require('../../../../config/colors.json').EMBED_INVIS_SIDEBAR
            );

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const Filter = require('bad-words');

module.exports = {
    developer: false,
    context: false,
    message: false,
    ignoreExecuteCheck: false,
    inDev: false,
    disabled: false,
    requiredBotPermissions: [PermissionFlagsBits.SendMessages],
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say whatever you want')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('The message to send')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        const msg = interaction.options.getString('message', true);

        if (!msg)
            return interaction.reply({
                content: 'Failed to send message: no message given',
            });

        const filter = new Filter();

        if (filter.isProfane(msg)) {
            const words = msg.split(' ');
            const profaneWords = new Array();
            words.forEach(w => {
                if (filter.isProfane(w)) profaneWords.push(w);
                else return;
            });
            const profanityFound = '- ' + profaneWords.join('\n- ');

            console.log(profanityFound);

            return interaction.reply({
                content: `Please do not use profane language with this command.\n## Violating words\n\n${profanityFound}`,
                ephemeral: true,
            });
        }

        interaction.channel.send({ content: msg, allowedMentions: [] });
        interaction.reply({
            content: 'Message sent in this channel',
            ephemeral: true,
        });
    },
};

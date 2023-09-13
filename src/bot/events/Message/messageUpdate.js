const { EmbedBuilder, Message, Events } = require('discord.js');
const Settings = require('../../../private/mongodb/guildSettings.js');
const colors = require('../../../../config/colors.json');

module.exports = {
    name: Events.MessageUpdate,
    /**
     *
     * @param {Message} oldMessage
     * @param {Message} newMessage
     */
    async execute(oldMessage, newMessage) {
        const guild = oldMessage.guild;
        const settings = await Settings.findOne({ GuildID: guild.id });
        if (!settings) return;
        const channelLog = settings.MsgEventChannel;
        if (!channelLog) return;

        await oldMessage.fetch(true);
        await newMessage.fetch(true);

        const maxLength = 4096;

        if (oldMessage.content == newMessage.content) return;

        const Original =
            oldMessage.content.length > maxLength
                ? oldMessage.content.slice(0, maxLength - 3) + '...'
                : oldMessage.content;
        const Edited =
            newMessage.content.length > maxLength
                ? newMessage.content.slice(0, maxLength - 3) + '...'
                : newMessage.content;

        const OriginalEmbed = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('Original')
            .setDescription(`${Original}`);
        const EditedEmbed = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('Edited')
            .setDescription(`${Edited}`)
            .setTimestamp();

        if (oldMessage.author == null || newMessage.author == null) {
            const embed = new EmbedBuilder()
                .setColor(colors.EMBED_INVIS_SIDEBAR)
                .setTitle('Message edited')
                .setAuthor({ name: 'Unknown user' });

            const channel = guild.channels.cache.get(`${channelLog}`);
            return channel
                ? channel.send({ embeds: [embed, OriginalEmbed, EditedEmbed] })
                : null;
        }

        const Log = new EmbedBuilder()
            .setTitle('Message edited')
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setDescription(
                `A message by <@${oldMessage.author.id}> was edited\n\n[**Jump to message**](${newMessage.url})`
            );

        const channel = guild.channels.cache.get(`${channelLog}`);
        return channel
            ? channel.send({ embeds: [Log, OriginalEmbed, EditedEmbed] })
            : null;
    },
};

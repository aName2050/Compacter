const { EmbedBuilder, Message, Events } = require('discord.js');
const Settings = require('../../../private/mongodb/guildSettings.js');
const colors = require('../../../../config/colors.json');

module.exports = {
    name: Events.MessageDelete,
    /**
     *
     * @param {Message} message
     */
    async execute(message) {
        const guild = message.guild;
        const settings = await Settings.findOne({ GuildID: guild.id });
        if (!settings) return;
        const channelLog = settings.MsgEventChannel;
        if (!channelLog) return;

        if (message.author == null) {
            const embed = new EmbedBuilder()
                .setTitle('Deleted Message')
                .setAuthor({ name: 'Unknown user' })
                .setDescription(
                    `${message.content ? message.content : '`None`'}`.slice(
                        0,
                        4096
                    )
                );
            const channel = guild.channels.cache.get(`${channelLog}`);
            return channel
                ? channel
                      .send({ embeds: [embed] })
                      .catch(err => console.error(err))
                : null;
        }

        if (message.author.bot) return;

        const Log = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setDescription(
                `A message sent by <@${message.author.id}> was deleted in <#${message.channel.id}>`
            );
        const Message = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('Deleted Message')
            .setDescription(
                `${
                    message.content ? message.content : '`No message content`'
                }`.slice(0, 4096)
            );
        const Attachments = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setTitle('Attachments');

        if (message.attachments.size > 0) {
            Attachments.addFields({
                name: `${
                    message.attachments.size == 1
                        ? `${message.attachments.size} attachment`
                        : `${message.attachments.size} attachments`
                }`,
                value: `${message.attachments.map(a => a.url).join('\n')}`,
                inline: false,
            });

            message.attachments.map(a => {
                if (
                    !a.url.endsWith('.png') ||
                    !a.url.endsWith('.jpg') ||
                    !a.url.endsWith('.jpeg') ||
                    !a.url.endsWith('.mov') ||
                    !a.url.endsWith('.mp4')
                )
                    Attachments.setDescription(
                        '⚠️ Some of these attachments may need to be downloaded to be viewed and may harm your system. **Download these attachments at your own risk**'
                    );
            });

            if (!message.content)
                await guild.channels.cache
                    .get(`${channelLog}`)
                    .send({ embeds: [Log, Attachments] })
                    .catch(e => console.log(e));
            else
                await guild.channels.cache
                    .get(`${channelLog}`)
                    .send({ embeds: [Log, Message, Attachments] })
                    .catch(e => console.log(e));
        } else {
            await guild.channels.cache
                .get(`${channelLog}`)
                .send({ embeds: [Log, Message] });
        }
    },
};

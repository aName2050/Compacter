const { EmbedBuilder, GuildMember, Events } = require('discord.js');
const Settings = require('../../../private/mongodb/guildSettings.js');
const colors = require('../../../../config/colors.json');

module.exports = {
    name: Events.GuildMemberRemove,
    /**
     *
     * @param {GuildMember} member
     */
    async execute(member) {
        const { user, guild } = member;

        const settings = await Settings.findOne({ GuildID: guild.id });
        if (!settings) return;
        const channelLog = settings.MemberLogChannel;
        const rulesChannel = settings.RulesChannel;
        if (!channelLog || !rulesChannel) return;

        const embed = new EmbedBuilder()
            .setColor(colors.EMBED_INVIS_SIDEBAR)
            .setAuthor({
                name: user.username,
                iconURL: user.avatarURL({ forceStatic: false, size: 512 }),
            })
            .setDescription(
                `**${user.username}** left the server!\nJoined <t:${parseInt(
                    member.joinedTimestamp / 1000
                )}:R>`
            )
            .setFooter({
                text: `ID: ${member.id}`,
            })
            .setTimestamp();

        await guild.channels.cache
            .get(`${channelLog}`)
            .send({ embeds: [embed] })
            .catch(e => console.log(e));
    },
};

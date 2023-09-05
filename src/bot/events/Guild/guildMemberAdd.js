const { EmbedBuilder, GuildMember, Events } = require('discord.js');
const Settings = require('../../../private/mongodb/guildSettings.js');
const colors = require('../../../../config/colors.json');

module.exports = {
    name: Events.GuildMemberAdd,
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
            .setColor(guild.roles.highest.hexColor.toString())
            .setAuthor({
                name: user.username,
                iconURL: user.avatarURL({ forceStatic: false, size: 512 }),
            })
            .setDescription(
                `Welcome to **${guild.name}**!\nPlease read the <#${
                    rulesChannel.id
                }> before engaging in activities in this server!\n\nAccount created <t:${parseInt(
                    user.createdTimestamp / 1000
                )}:R>`
            )
            .setFooter({
                text: `ID: ${member.id} • Member #${member.guild.memberCount}`,
            })
            .setTimestamp();

        await guild.channels.cache
            .get(`${channelLog}`)
            .send({ content: `<@${member.id}>`, embeds: [embed] })
            .catch(e => console.log(e));
    },
};

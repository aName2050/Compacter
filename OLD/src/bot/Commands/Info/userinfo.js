const {
    UserContextMenuCommandInteraction,
    EmbedBuilder,
    ContextMenuCommandBuilder,
    PermissionFlagsBits,
    ApplicationCommandType,
    AttachmentBuilder,
} = require('discord.js');
const { addSuffix } = require('../../../util/helpers/fancyNumbers.js');
const { getProfileBadgeIcons } = require('../../../util/helpers/userBadges.js');
const { profileImage } = require('discord-arts');

module.exports = {
    developer: false,
    context: true,
    message: false,
    ignoreExecuteCheck: false,
    inDev: false,
    disabled: false,
    requiredBotPermissions: [PermissionFlagsBits.SendMessages],
    data: new ContextMenuCommandBuilder()
        .setName('User Info')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     *
     * @param {UserContextMenuCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply();

        const member = interaction.targetMember;

        if (member.user.bot)
            return interaction.editReply({
                content:
                    'Bots are not supported with this command, try using `/status` to view my status!',
            });

        try {
            const fetchedMembers = await interaction.guild.members.fetch();

            const profileBuffer = await profileImage(member.id, {
                borderColor: member.displayHexColor,
                customTag: '‎',
            });
            const imageAttachment = new AttachmentBuilder(profileBuffer, {
                name: 'profile.png',
            });

            const joinPosition =
                Array.from(
                    fetchedMembers
                        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                        .keys()
                ).indexOf(member.id) + 1;

            const topRoles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map(role => role)
                .slice(0, 3);

            const userBadges = member.user.flags.toArray();

            const joinTime = parseInt(member.joinedTimestamp / 1000);
            const createdTime = parseInt(member.user.createdTimestamp / 1000);

            const Booster = member.premiumSince
                ? '<:discordboost7:1133902522629759058>'
                : 'Not boosting';

            const Embed = new EmbedBuilder()
                .setAuthor({
                    name: `${member.user.username}`,
                    iconURL: member.displayAvatarURL(),
                })
                .setColor(
                    require('../../../../config/colors.json')
                        .EMBED_INVIS_SIDEBAR
                )
                .setDescription(
                    `${member.user.username} joined as the **${addSuffix(
                        joinPosition
                    )}** member of this server on <t:${joinTime}:D>.`
                )
                .setImage('attachment://profile.png')
                .addFields(
                    {
                        name: 'Badges',
                        value: `${getProfileBadgeIcons(userBadges).join('')}`,
                        inline: true,
                    },
                    {
                        name: 'Booster',
                        value: `${Booster}`,
                        inline: true,
                    },
                    {
                        name: 'Top 3 Roles',
                        value: `${topRoles.join('')}`,
                        inline: false,
                    },
                    {
                        name: 'Created',
                        value: `<t:${createdTime}:R>`,
                        inline: true,
                    },
                    { name: 'User ID', value: `${member.id}`, inline: false },
                    {
                        name: 'Avatar',
                        value: `[View Avatar](${member.displayAvatarURL()})`,
                        inline: true,
                    },
                    {
                        name: 'Banner',
                        value:
                            (member.user.bannerURL() != null) | undefined
                                ? `[View Banner](${member.user.bannerURL()})`
                                : 'No Banner',
                        inline: true,
                    }
                );
            interaction.editReply({
                embeds: [Embed],
                files: [imageAttachment],
            });
        } catch (error) {
            interaction.editReply({
                content: `An error occured while executing this command: \`${error}\``,
            });
            console.log(error);
        }
    },
};

const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    Client,
} = require('discord.js');
const GuildSettings = require('../../../private/mongodb/guildSettings.js');
const InfractionsModel = require('../../../private/mongodb/infractionsModel.js');
const { EMBED_INVIS_SIDEBAR } = require('../../../../config/colors.json');

module.exports = {
    developer: false,
    context: false,
    message: false,
    ignoreExecuteCheck: false,
    inDev: false,
    disabled: false,
    requiredBotPermissions: [
        PermissionFlagsBits.BanMembers,
        PermissionFlagsBits.SendMessages,
    ],
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason you are banning this user')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const user = options.getUser('user');
        const reason = options.getString('reason');

        const log = new EmbedBuilder()
            .setTitle('User Banned')
            .setColor(EMBED_INVIS_SIDEBAR)
            .setDescription(
                `<@${user.id}> banned by <@${interaction.user.id}>\n\n**Reason**\n${reason}`
            );

        const userInfractions = await InfractionsModel.findOne({
            UserID: user.id,
        });
        const infraction = {
            Timestamp: Date.now(),
            GuildID: guild.id,
            ModeratorID: interaction.user.id,
            Type: 'Server Ban',
            Reason: reason,
        };
        if (userInfractions) {
            if (userInfractions.Infractions != '') {
                // const tmp1 = JSON.parse(userInfractions.Infractions);
                // const tmp2 = tmp1.push(infraction);
                // const tmp3 = JSON.stringify(tmp2);
                const tmp1 = JSON.parse(userInfractions.Infractions);
                tmp1.push(infraction);
                const tmp2 = JSON.stringify(tmp1);
                await userInfractions.updateOne({
                    Infractions: tmp2,
                });
            } else {
                await userInfractions.updateOne({
                    Infractions: JSON.stringify([infraction]),
                });
            }
        }
        if (!userInfractions || !userInfractions.Infractions) {
            await InfractionsModel.create({
                UserID: user.id,
                Infractions: JSON.stringify([infraction]),
            });
        }

        const userEmbed = new EmbedBuilder()
            .setColor(EMBED_INVIS_SIDEBAR)
            .setDescription(
                `You have been banned from **${guild.name}** by <@${interaction.user.id}>.\n\n**Reason**\n${reason}`
            );
        await user.send({ embeds: [userEmbed] });

        const member = guild.members.cache.get(user.id);
        if (
            interaction.guild.roles.botRoleFor(client.user).position <
            guild.members.cache.get(user.id).roles.highest.position
        )
            return interaction.reply({
                content:
                    'Failed to ban this member: user has higher role than bot',
                ephemeral: true,
            });
        await member.ban({ deleteMessageSeconds: null, reason: reason });

        const settings = await GuildSettings.findOne({ GuildID: guild.id });
        settings
            ? settings.ModActionChannel
                ? await guild.channels.cache
                      .get(`${settings.ModActionChannel}`)
                      .send({ embeds: [log] })
                      .catch(e => console.log(e))
                : null
            : null;

        interaction.reply({ embeds: [log] });
        setTimeout(() => {
            interaction.deleteReply();
        }, 7500);
    },
};

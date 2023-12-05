const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    Client,
} = require('discord.js');
const Infractions = require('../../../../private/mongodb/infractionsModel.js');

module.exports = {
    subCommand: 'infractions.view-this-server',
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;
        const user = options.getUser('user');

        const userRecord = await Infractions.findOne({ UserID: user.id });
        const allInfractions = JSON.parse(userRecord.Infractions);
        const infractions = new Array();
        allInfractions.forEach((infraction, i) => {
            if (infraction.GuildID == interaction.guild.id) {
                infractions.push(infraction);
            }
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${user.id}` })
            .setTitle(`${user.username}'s Server Infractions`)
            .setDescription(
                `${
                    infractions.length > 0
                        ? infractions.length === 1
                            ? 'This user has 1 infraction'
                            : `This user has ${infractions.length} infractions`
                        : 'This user has no infractions'
                } in this server`
            )
            .setColor(
                require('../../../../../config/colors.json').EMBED_INVIS_SIDEBAR
            )
            .setFooter({
                text: 'After removing an infraction, rerun this command to update this list',
            });
        const actionRow = new ActionRowBuilder().setComponents(
            new StringSelectMenuBuilder()
                .setCustomId('infractions.manage.thisGuild')
                .setPlaceholder('No infraction selected')
        );
        infractions.forEach((i, index) => {
            actionRow.components[0].addOptions({
                label: i.Type.toString(),
                description:
                    'Moderator: ' +
                    client.users.cache.get(i.ModeratorID).username,
                value: index.toString(),
            });
        });

        interaction.reply({
            embeds: [embed],
            components: infractions.length === 0 ? [] : [actionRow],
            ephemeral: true,
        });
    },
};

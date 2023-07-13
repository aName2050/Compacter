const {
    Client,
    EmbedBuilder,
    StringSelectMenuInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const Infractions = require('../../../private/mongodb/infractionsModel.js');

module.exports = {
    id: 'infractions.manage.thisGuild',
    /**
     * @param {StringSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const option = interaction.values[0];

        const userRecord = await Infractions.findOne({
            UserID: interaction.message.embeds[0].author.name,
        });
        const infraction = JSON.parse(userRecord.Infractions)[option];

        const modUsername = client.users.cache.get(
            infraction.ModeratorID
        ).username;
        const discordTimestamp = `<t:${Math.floor(
            parseInt(infraction.Timestamp) / 1000
        )}:F>`;

        const embed = new EmbedBuilder()
            .setTitle(infraction.Type)
            .setDescription(
                `Issued by **@${modUsername}** on ${discordTimestamp}\n\n**Reason:**\n${infraction.Reason}`
            )
            .setColor(
                require('../../../../config/colors.json').EMBED_INVIS_SIDEBAR
            );

        const actionRow = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId(
                    `infractions.remove:current;${option};${interaction.message.embeds[0].author.name}`
                )
                .setLabel('Remove this infraction')
                .setStyle(ButtonStyle.Danger)
        );

        interaction.reply({
            embeds: [embed],
            components: [actionRow],
            ephemeral: true,
        });
    },
};

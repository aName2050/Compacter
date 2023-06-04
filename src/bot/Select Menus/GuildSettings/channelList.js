const {
    StringSelectMenuInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const DB = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'settings.channelMenu',
    /**
     * @param {StringSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.user.id != interaction.guild.ownerId)
            return interaction.reply({
                content:
                    '```You must be the owner of the guild to edit settings```',
                ephemeral: true,
            });

        const Settings = await DB.findOne({
            GuildID: interaction.guildId,
        });

        const channel = interaction.values[0];
        const setting = interaction.message.embeds[0].title;

        switch (setting) {
            case 'Message Report Logging':
                {
                }
                break;
            case 'Message Event Logging':
                {
                }
                break;
            case 'Moderation Logging':
                {
                }
                break;
            case 'Member Logging':
                {
                }
                break;
            case 'Compacter Premium':
                {
                }
                break;
            default:
                embed.setDescription(
                    '```A problem occured while fetching this setting```'
                );
                break;
        }

        // interaction.reply({ content: [embed], components: components });
    },
};

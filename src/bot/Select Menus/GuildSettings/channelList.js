const {
    StringSelectMenuInteraction,
    Client,
    EmbedBuilder,
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
                content: 'You must be the owner of the guild to edit settings',
                ephemeral: true,
            });

        const channel = interaction.values;
        const setting = interaction.message.embeds[0].title;

        const embed = new EmbedBuilder()
            .setTitle(`${setting}`)
            .setColor(
                require('../../../../config/colors.json').EMBED_INVIS_SIDEBAR
            )
            .setDescription(
                `Successfully updated this setting.\n\n**New value:** <#${channel}>`
            );

        switch (setting) {
            case 'Report Logging':
                {
                    await DB.findOneAndUpdate(
                        { GuildID: interaction.guildId },
                        { ReportChannel: channel[0].toString() },
                        {
                            new: true,
                            upsert: true,
                        }
                    );
                }
                break;
            case 'Message Event Logging':
                {
                    await DB.findOneAndUpdate(
                        { GuildID: interaction.guildId },
                        { MsgEventChannel: channel[0].toString() },
                        {
                            new: true,
                            upsert: true,
                        }
                    );
                }
                break;
            case 'Moderation Logging':
                {
                    await DB.findOneAndUpdate(
                        { GuildID: interaction.guildId },
                        { ModActionChannel: channel[0].toString() },
                        {
                            new: true,
                            upsert: true,
                        }
                    );
                }
                break;
            case 'Member Logging':
                {
                    await DB.findOneAndUpdate(
                        { GuildID: interaction.guildId },
                        { MemberLogChannel: channel[0].toString() },
                        {
                            new: true,
                            upsert: true,
                        }
                    );
                    if (channel[1])
                        await DB.findOneAndUpdate(
                            { GuildID: interaction.guildId },
                            { RulesChannel: channel[1].toString() },
                            { new: true, upsert: true }
                        );
                }
                break;
            case 'Compacter Premium':
                {
                    embed.setDescription(
                        'Sorry, this setting is currently unavailable.'
                    );
                }
                break;
            default:
                embed.setDescription(
                    'A problem occured while editting this setting: unknown setting'
                );
                break;
        }

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

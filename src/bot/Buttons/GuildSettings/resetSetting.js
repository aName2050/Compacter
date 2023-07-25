const { ButtonInteraction, Client } = require('discord.js');
const DB = require('../../../private/mongodb/guildSettings.js');

module.exports = {
    id: 'resetSetting',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        if (interaction.user.id != interaction.guild.ownerId)
            return interaction.reply({
                content:
                    'You must be the owner of the server to edit this setting',
                ephemeral: true,
            });

        switch (data) {
            case 'Report Logging':
                {
                    await DB.findOneAndUpdate(
                        { GuildID: interaction.guildId },
                        { ReportChannel: '' }
                    );
                }
                break;
            case 'Message Event Logging':
                {
                    await DB.findOneAndUpdate(
                        { GuildID: interaction.guildId },
                        { MsgEventChannel: '' }
                    );
                }
                break;
            case 'Moderation Logging':
                {
                    await DB.findOneAndUpdate(
                        { GuildID: interaction.guildId },
                        { ModActionChannel: '' }
                    );
                }
                break;
            case 'Member Logging':
                {
                    await DB.findOneAndUpdate(
                        { GuildID: interaction.guildId },
                        { MemberLogChannel: '', RulesChannel: '' }
                    );
                }
                break;
            case 'Compacter Premium':
                {
                    // currently unavailable
                }
                break;
            default:
                return interaction.reply({
                    content: 'Unable to reset this setting: unknown setting',
                    ephemeral: true,
                });
        }

        interaction.reply({
            content: 'This setting has been reset',
            ephemeral: true,
        });
    },
};

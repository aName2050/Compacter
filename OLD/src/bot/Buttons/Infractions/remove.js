const { ButtonInteraction, Client, EmbedBuilder } = require('discord.js');
const Infractions = require('../../../private/mongodb/infractionsModel.js');
const { removeAtIndex } = require('../../../util/helpers/arraryFuncs.js');

module.exports = {
    id: 'infractions.remove',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const type = data.split(';')[0];
        const infractionID = data.split(';')[1];
        const userID = data.split(';')[2];

        const userRecord = await Infractions.findOne({ UserID: userID });

        const allInfractions = JSON.parse(userRecord.Infractions);

        if (type.toLowerCase() === 'current') {
            const type = data.split(';')[0];
            const infractionID = data.split(';')[1];
            const userID = data.split(';')[2];

            const userRecord = await Infractions.findOne({ UserID: userID });

            const allInfractions = JSON.parse(userRecord.Infractions);

            const newList = removeAtIndex(allInfractions, infractionID);

            await Infractions.updateOne(
                { UserID: userID },
                { Infractions: JSON.stringify(newList) }
            );

            interaction.reply({
                content: `Successfully removed infraction with ID \`${infractionID}\``,
                ephemeral: true,
            });
            return;
        } else if (type.toLowerCase() === 'all') {
            const newList = removeAtIndex(allInfractions, infractionID);

            await Infractions.updateOne(
                { UserID: userID },
                { Infractions: JSON.stringify(newList) }
            );

            interaction.reply({
                content: `Successfully removed infraction with ID \`${infractionID}\``,
                ephemeral: true,
            });

            return;
        } else {
            return interaction.reply({
                content: 'We encountered an error while handling your request',
                ephemeral: true,
            });
        }
    },
};

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
        const infractionID = data.split(';')[0],
            userID = data.split(';')[1];
        const userRecord = await Infractions.findOne({ UserID: userID });
        const allInfractions = JSON.parse(userRecord.Infractions);
        const infractions = new Array();
        allInfractions.forEach((infraction, i) => {
            if (infraction.GuildID == interaction.guild.id)
                infractions.push(infraction);
        });

        console.log(infractions);
        const newList = removeAtIndex(infractions, infractionID);
        console.log(newList);
        await Infractions.updateOne(
            { UserID: userID },
            { Infractions: JSON.stringify(newList) }
        );

        interaction.reply({
            content: `Successfully removed infraction with ID \`${infractionID}\``,
            ephemeral: true,
        });
    },
};

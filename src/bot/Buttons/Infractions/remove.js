const { ButtonInteraction, Client, EmbedBuilder } = require('discord.js');
const Infractions = require('../../../private/mongodb/infractionsModel.js');

module.exports = {
    id: 'infraction.remove',
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        const infractionID = data.split(';')[0],
            userID = data.split(';')[1];
        const userRecord = await Infractions.findOne({ UserID: userID });
        const infraction = JSON.parse(userRecord.Infractions)[infractionID];

        // TODO: finish
        // INFO: https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
    },
};

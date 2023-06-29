const { model, Schema } = require('mongoose');

module.exports = model(
    'infractions',
    new Schema({
        UserID: String,
        Infractions: [
            {
                Timestamp: String,
                GuildID: String,
                ModeratorID: String,
                Type: String,
                Reason: String,
            },
        ],
    }),
    'infractions'
);

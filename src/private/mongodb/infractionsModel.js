const { model, Schema } = require('mongoose');

module.exports = model(
    'infractions',
    new Schema({
        UserID: String,
        Infractions: [{ GuildID: String, ModeratorID: String, Reason: String }],
    }),
    'infractions'
);

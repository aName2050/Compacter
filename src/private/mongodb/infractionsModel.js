const { model, Schema } = require('mongoose');

/**
 * Infractions JSON Object String:
 * Timestamp [Date.now()];
 * GuildID;
 * ModeratorID;
 * Type [Ban/Kick/Timeout/Warn];
 * Reason
 */
module.exports = model(
    'infractions',
    new Schema({
        UserID: {
            type: String,
            required: true,
        },
        Infractions: {
            type: String,
            required: true,
            default: '[]',
        },
    }),
    'infractions'
);

const { model, Schema } = require('mongoose');

module.exports = model(
    'guildSettings',
    new Schema({
        GuildID: {
            type: String,
            default: '',
        },
        ModActionChannel: {
            type: String,
            default: '',
        },
        MsgEventChannel: {
            type: String,
            default: '',
        },
        ReportChannel: {
            type: String,
            default: '',
        },
        MemberLogChannel: {
            type: String,
            default: '',
        },
        RulesChannel: {
            type: String,
            default: '',
        },
        PremiumTier: {
            type: String,
            default: '',
        },
    })
);

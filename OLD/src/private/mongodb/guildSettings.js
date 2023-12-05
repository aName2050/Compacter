const { model, Schema } = require('mongoose');

module.exports = model(
    'guildSettings',
    new Schema({
        GuildID: {
            type: String,
            required: true,
        },
        ModActionChannel: {
            type: String,
            default: '',
            required: false,
        },
        MsgEventChannel: {
            type: String,
            default: '',
            required: false,
        },
        ReportChannel: {
            type: String,
            default: '',
            required: false,
        },
        MemberLogChannel: {
            type: String,
            default: '',
            required: false,
        },
        RulesChannel: {
            type: String,
            default: '',
            required: false,
        },
        PremiumTier: {
            type: String,
            default: '',
            required: false,
        },
        IgnoredChannels: {
            Universal: {
                type: String,
                default: '[]',
                required: false,
            },
        },
    }),
    'guildsettings'
);

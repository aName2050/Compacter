const { model, Schema } = require('mongoose');

module.exports = model(
    'guildSettings',
    new Schema({
        GuildID: String,
        ModActionChannel: String,
        MsgEventChannel: String,
        ReportChannel: String,

        MemberLogChannel: String,
        RulesChannel: String,

        PremiumTier: String,
    })
);

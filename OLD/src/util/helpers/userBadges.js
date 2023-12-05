function getProfileBadgeIcons(badgeNames) {
    if (!badgeNames.length) return [];
    const badgeMap = {
        ActiveDeveloper: '<:activedeveloper:1133902520129949766>',
        BugHunterLevel1: '<:discordbughunter1:1133902527142838293>',
        BugHunterLevel2: '<:discordbughunter2:1133902528560508928>',
        PremiumEarlySupporter: '<:discordearlysupporter:1133902529797836924>',
        Partner: '<:discordpartner:1133904113940320277>',
        Staff: '<:discordstaff:1133902535787294770> ',
        HypeSquadOnlineHouse1: '<:hypesquadbravery:1133902539163701389>', // bravery
        HypeSquadOnlineHouse2: '<:hypesquadbrilliance:1133902541210538014>', // brilliance
        HypeSquadOnlineHouse3: '<:hypesquadbalance:1133902537779597414>', // balance
        Hypesquad: '<:hypesquadevents:1133902620679995392>',
        CertifiedModerator: '<:discordmod:1133902532071137280>',
        VerifiedDeveloper: '<:discordbotdev:1133902524332638349>',
    };

    return badgeNames.map(badgeName => badgeMap[badgeName] || '');
}

module.exports = { getProfileBadgeIcons };

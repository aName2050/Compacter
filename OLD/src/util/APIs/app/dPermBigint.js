const djs = require('discord.js');

function permissionsFromInt(int) {
    let permissions = {};
    for (let flag in djs.PermissionFlagsBits) {
        permissions[flag] =
            (int & Number(djs.PermissionFlagsBits[flag])) ===
            Number(djs.PermissionFlagsBits[flag]);
    }
    return permissions;
}

module.exports = { getPerm: permissionsFromInt };

const { Client, Events } = require('discord.js');
const chalk = require('chalk');
const { log } = require('../../../util/helpers/log.js');

module.exports = {
    name: Events.ShardDisconnect,
    /**
     *
     * @param {Client} client
     */
    async execute(event, id, client) {
        log(
            chalk.bgBlackBright.bold(' SHARDS '),
            true,
            chalk.yellow.bold('::1 '),
            `Shard ${id}`,
            chalk.redBright(' DISCONNECTED')
        );
        console.log(event);
    },
};

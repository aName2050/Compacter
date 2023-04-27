const { Client, Events } = require('discord.js');
const chalk = require('chalk');
const { log } = require('../../../util/helpers/log.js');

module.exports = {
    name: Events.ShardReady,
    /**
     *
     * @param {Client} client
     */
    async execute(id, client) {
        log(
            chalk.bgBlackBright.bold(' SHARDS '),
            true,
            chalk.yellow.bold('::1 '),
            `Shard ${id}`,
            chalk.greenBright(' READY')
        );
    },
};

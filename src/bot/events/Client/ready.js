const { Client, ActivityType, Events } = require('discord.js');
const { printTable } = require('console-table-printer');
const chalk = require('chalk');
const { log } = require('../../../util/helpers/log');
const mongoose = require('mongoose');
const botConfig = require('../../../../config/bot.json');

const { loadCommands } = require('../../Handlers/commandHandler.js');
const { loadButtons } = require('../../Handlers/buttonHandler');
const { loadSelectMenus } = require('../../Handlers/selectMenuHandler');
// const { loadModals } = require('../../Handlers/modalHandler');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {Client} client
     */
    async execute(client) {
        client.user.setPresence({
            activities: [{ name: 'Math 101', type: ActivityType.Listening }],
            status: 'idle',
        });

        setInterval(() => {
            if (client.user.presence.status == 'idle') return;
            client.user.setPresence({
                activities: [
                    { name: 'Math 101', type: ActivityType.Listening },
                ],
                status: 'idle',
            });
        }, 10 * 60000);

        await loadCommands(client);
        await loadButtons(client);
        await loadSelectMenus(client);
        // await loadModals(client);

        // Connect database
        if (!botConfig.MONGO_SRV)
            log(
                chalk.bgGreen.bold(' MONGDB '),
                true,
                chalk.yellow.bold('::1 '),
                chalk.redBright('Missing SRV')
            );
        else {
            await mongoose
                .connect(botConfig.MONGO_SRV, { autoIndex: true })
                .then(() => {
                    log(
                        chalk.bgGreen.bold(' MONGDB '),
                        true,
                        chalk.yellow.bold('::1 '),
                        chalk.greenBright('CONNECTED')
                    );
                })
                .catch(err => {
                    log(
                        chalk.bgGreen.bold(' MONGDB '),
                        true,
                        chalk.yellow.bold('::1 '),
                        chalk.redBright('Failed to connect')
                    );
                    console.log(err);
                });
        }

        const totalShards = client.shard.count;

        const clientDetails = new Array();
        clientDetails.push({
            Item: 'Client',
            Status: chalk.greenBright('██  '),
            Details: `${client.user.tag}`,
        });
        clientDetails.push({
            Item: 'Stats',
            Status: chalk.greenBright('██  '),
            Details: `${client.guilds.cache.size} guilds, ${client.users.cache.size} users`,
        });
        if (client.ws.ping > 350)
            clientDetails.push({
                Item: 'Latency',
                Status: chalk.red('██  '),
                Details: `${client.ws.ping}ms`,
            });
        else if (client.ws.ping > 199)
            clientDetails.push({
                Item: 'Latency',
                Status: chalk.yellow('██  '),
                Details: `${client.ws.ping}ms`,
            });
        else if (client.ws.ping < 200)
            clientDetails.push({
                Item: 'Latency',
                Status: chalk.greenBright('██  '),
                Details: `${client.ws.ping}ms`,
            });

        clientDetails.push({
            Item: 'Shards',
            Status: chalk.greenBright('██  '),
            Details: `${totalShards} loaded`,
        });

        clientDetails.push({
            Item: 'Commands',
            Status: chalk.greenBright('██  '),
            Details: `${client.commands.size} loaded`,
        });
        clientDetails.push({
            Item: 'Subcommands',
            Status: chalk.greenBright('██  '),
            Details: `${client.subCommands.size} loaded`,
        });

        clientDetails.push({
            Item: 'Events',
            Status: chalk.greenBright('██  '),
            Details: `${client.events.size} loaded`,
        });

        clientDetails.push({
            Item: 'Buttons',
            Status: chalk.greenBright('██  '),
            Details: `${client.buttons.size} loaded`,
        });

        clientDetails.push({
            Item: 'Select Menus',
            Status: chalk.greenBright('██  '),
            Details: `${client.selectMenus.size} loaded`,
        });

        clientDetails.push({
            Item: 'Modals',
            Status: chalk.greenBright('██  '),
            Details: `${client.modals.size} loaded`,
        });

        log(
            chalk.bgGreen.bold(' CLIENT '),
            true,
            chalk.yellow.bold(`... `),
            'Client Details'
        );
        printTable(clientDetails);
        log(
            chalk.bgGreen.bold(' CLIENT '),
            true,
            chalk.yellow.bold(`... `),
            'Bot Client ',
            chalk.greenBright('READY')
        );
    },
};

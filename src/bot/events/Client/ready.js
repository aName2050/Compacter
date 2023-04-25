const { Client, ActivityType, Events } = require('discord.js');
const { printTable } = require('console-table-printer');
const chalk = require('chalk');
const { log } = require('../../../util/helpers/log');

const { loadCommands } = require('../../handlers/commandHandler.js');
// const { loadButtons } = require('../../Handlers/buttonHandler');
// const { loadSelectMenus } = require('../../Handlers/selectMenuHandler');
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
        // await loadButtons(client);
        // await loadSelectMenus(client);
        // await loadModals(client);

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
                Status: chalk.redBright('██  '),
                Details: `${client.ws.ping}ms`,
            });
        else if (client.ws.ping > 199)
            clientDetails.push({
                Item: 'Latency',
                Status: chalk.yellowBright('██  '),
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
            Details: 'Ready',
        });

        if (client.errors.commands.length >= 1)
            clientDetails.push({
                Item: 'Commands',
                Status: chalk.redBright('██  '),
                Details: `${client.commands.size} loaded, ${client.errors.commands.length} error(s)`,
            });
        else
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

        if (client.errors.events.length >= 1)
            clientDetails.push({
                Item: 'Events',
                Status: chalk.redBright('██  '),
                Details: `${client.events.size} loaded, ${client.errors.events.length} error(s)`,
            });
        else
            clientDetails.push({
                Item: 'Events',
                Status: chalk.greenBright('██  '),
                Details: `${client.events.size} loaded`,
            });

        if (client.errors.buttons.length >= 1)
            clientDetails.push({
                Item: 'Buttons',
                Status: chalk.redBright('██  '),
                Details: `${client.buttons.size} loaded, ${client.errors.buttons.length} error(s)`,
            });
        else
            clientDetails.push({
                Item: 'Buttons',
                Status: chalk.greenBright('██  '),
                Details: `${client.buttons.size} loaded`,
            });

        if (client.errors.selectMenus.length >= 1)
            clientDetails.push({
                Item: 'Select Menus',
                Status: chalk.redBright('██  '),
                Details: `${client.selectMenus.size} loaded, ${client.errors.selectMenus.length} error(s)`,
            });
        else
            clientDetails.push({
                Item: 'Select Menus',
                Status: chalk.greenBright('██  '),
                Details: `${client.selectMenus.size} loaded`,
            });

        if (client.errors.modals.length >= 1)
            clientDetails.push({
                Item: 'Modals',
                Status: chalk.redBright('██  '),
                Details: `${client.modals.size} loaded, ${client.errors.modals.length} error(s)`,
            });
        else
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
    },
};

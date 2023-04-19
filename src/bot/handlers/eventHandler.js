const chalk = require('chalk');
const { loadFiles } = require('../../util/helpers/fileLoader.js');
const { printTable } = require('console-table-printer');
const table = require('console-table-printer');
const { log } = require('../../util/helpers/log.js');

async function loadEvents(client) {
    const start = Date.now();
    const events = new Array();

    const files = await loadFiles('Events');

    for (const file of files) {
        try {
            const event = require(file);
            const execute = (...args) => event.execute(...args, client);
            const target = event.rest ? client.rest : client;

            target[event.once ? 'once' : 'on'](event.name, execute);
            client.events.set(event.name, execute);

            events.push({ Event: event.name, Status: chalk.greenBright('██') });
        } catch (error) {
            events.push({
                Event: file.split('/').pop().slice(0, -3),
                Status: chalk.redBright('██'),
            });
        }
    }
    log(
        chalk.bgMagentaBright.bold(' CLIENT '),
        true,
        chalk.yellow.bold(`... `),
        chalk.greenBright('Loaded '),
        chalk.white.bold(`(${events.length})`),
        ' events in ',
        chalk.white.bold(`${Date.now() - start}ms`)
    );
    if (events.length == 0) return;
    printTable(events);
}

module.exports = { loadEvents };

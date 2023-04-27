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

            if (!event?.name || !event?.execute) continue;

            const execute = (...args) => event.execute(...args, client);
            const target = event.rest ? client.rest : client;

            target[event.once ? 'once' : 'on'](event.name, execute);
            client.events.set(event.name, execute);

            if (event.rest) {
                events.push({
                    Event: event.name,
                    Status: chalk.rgb(255, 165, 0)('██  '),
                });
                continue;
            }
            if (event.once) {
                events.push({
                    Event: event.name,
                    Status: chalk.blue('██  '),
                });
                continue;
            }

            events.push({
                Event: event.name,
                Status: chalk.greenBright('██  '),
            });
        } catch (error) {
            log(
                chalk.bgMagentaBright.bold(' CLIENT '),
                true,
                chalk.yellow.bold(`... `),
                chalk.redBright(`${chalk.bold('ERROR')} while loading events`)
            );
            console.log(error);
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

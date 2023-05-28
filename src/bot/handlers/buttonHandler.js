const { loadFiles } = require('../../util/helpers/fileLoader.js');
const { log } = require('../../util/helpers/log.js');
const chalk = require('chalk');
const { printTable } = require('console-table-printer');

async function loadButtons(client) {
    const start = Date.now();

    const buttons = new Array();

    const files = await loadFiles('Buttons');

    for (const file of files) {
        try {
            const button = require(file);

            if (!button.id)
                buttons.push({
                    Button: file.split('/').pop().slice(0, -3),
                    Status: chalk.redBright('██  '),
                    Error: 'Missing menu ID',
                });
            if (!button.execute)
                buttons.push({
                    Button: file.split('/').pop().slice(0, -3),
                    Status: chalk.redBright('██  '),
                    Error: 'Missing execute function',
                });

            if (button.id && button.execute)
                buttons.push({
                    Button: button.id,
                    Status: chalk.greenBright('██  '),
                });

            client.buttons.set(button.id, button);
        } catch (e) {
            log(
                chalk.bgMagentaBright.bold(' CLIENT '),
                true,
                chalk.yellow.bold(`... `),
                chalk.redBright(`${chalk.bold('ERROR')} while loading buttons`)
            );
            console.log(e);
        }
    }

    log(
        chalk.bgMagentaBright.bold(' CLIENT '),
        true,
        chalk.yellow.bold(`... `),
        chalk.greenBright('Loaded '),
        chalk.white.bold(`(${buttons.length})`),
        ' buttons in ',
        chalk.white.bold(`${Date.now() - start}ms`)
    );
    if (buttons.length) printTable(buttons);
}

module.exports = { loadButtons };

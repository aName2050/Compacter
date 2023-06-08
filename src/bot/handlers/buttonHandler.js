const { loadFiles } = require('../../util/helpers/fileLoader.js');
const { log } = require('../../util/helpers/log.js');
const chalk = require('chalk');
const { printTable } = require('console-table-printer');
const path = require('path');

async function loadButtons(client) {
    const start = Date.now();

    const buttons = new Array();

    const files = await loadFiles('Buttons');

    for (const file of files) {
        try {
            const button = require(file);

            const errors = new Array();

            if (!button.id) errors.push('Missing button ID');
            if (!button.execute) errors.push('Missing callback');

            client.buttons.set(button.id, button);

            if (errors.length > 0) {
                buttons.push({
                    Button: path.basename(file),
                    Status: chalk.redBright('██  '),
                    Errors: errors.join(', '),
                });
            }

            if (!errors.length) {
                buttons.push({
                    Button: button.id,
                    Status: chalk.greenBright('██  '),
                });
                continue;
            }
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

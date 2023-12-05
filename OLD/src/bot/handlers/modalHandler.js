const { loadFiles } = require('../../util/helpers/fileLoader.js');
const { log } = require('../../util/helpers/log.js');
const chalk = require('chalk');
const { printTable } = require('console-table-printer');
const path = require('path');

async function loadModals(client) {
    const start = Date.now();

    const modals = new Array();

    const files = await loadFiles('Modals');

    for (const file of files) {
        try {
            const modal = require(file);

            const errors = new Array();

            if (!modal.id) errors.push('Missing modal ID');
            if (!modal.execute) errors.push('Missing callback');

            client.modals.set(modal.id, modal);

            if (errors.length > 0) {
                modals.push({
                    Modal: path.basename(file),
                    Status: chalk.redBright('██  '),
                    Errors: errors.join(', '),
                });
            }

            if (!errors.length) {
                modals.push({
                    Modal: modal.id,
                    Status: chalk.greenBright('██  '),
                });
                continue;
            }
        } catch (e) {
            log(
                chalk.bgMagentaBright.bold(' CLIENT '),
                true,
                chalk.yellow.bold(`... `),
                chalk.redBright(`ERROR while loading modals`)
            );
            console.log(e);
        }
    }

    log(
        chalk.bgMagentaBright.bold(' CLIENT '),
        true,
        chalk.yellow.bold(`... `),
        chalk.greenBright('Loaded '),
        chalk.white.bold(`(${modals.length})`),
        ' modals in ',
        chalk.white.bold(`${Date.now() - start}ms`)
    );
    if (modals.length) printTable(modals);
}

module.exports = { loadModals };

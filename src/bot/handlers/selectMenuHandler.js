const { loadFiles } = require('../../util/helpers/fileLoader.js');
const { log } = require('../../util/helpers/log.js');
const chalk = require('chalk');
const { printTable } = require('console-table-printer');
const path = require('path');

async function loadSelectMenus(client) {
    const start = Date.now();

    const menus = new Array();

    const files = await loadFiles('Select Menus');

    for (const file of files) {
        try {
            const selectMenu = require(file);

            const errors = new Array();

            if (!selectMenu.id) errors.push('Missing menu ID');
            if (!selectMenu.execute) errors.push('Missing callback');

            client.selectMenus.set(selectMenu.id, selectMenu);

            if (errors.length > 0) {
                menus.push({
                    SelectMenu: path.basename(file),
                    Status: chalk.redBright('██  '),
                    Errors: errors.join(', '),
                });
            }

            if (!errors.length) {
                menus.push({
                    SelectMenu: selectMenu.id,
                    Status: chalk.greenBright('██  '),
                });
                continue;
            }
        } catch (e) {
            log(
                chalk.bgMagentaBright.bold(' CLIENT '),
                true,
                chalk.yellow.bold(`... `),
                chalk.redBright(
                    `${chalk.bold('ERROR')} while loading select menus`
                )
            );
            console.log(e);
            nsole;
        }
    }

    log(
        chalk.bgMagentaBright.bold(' CLIENT '),
        true,
        chalk.yellow.bold(`... `),
        chalk.greenBright('Loaded '),
        chalk.white.bold(`(${menus.length})`),
        ' select menus in ',
        chalk.white.bold(`${Date.now() - start}ms`)
    );
    if (menus.length) printTable(menus);
}

module.exports = { loadSelectMenus };

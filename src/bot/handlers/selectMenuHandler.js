const { loadFiles } = require('../../util/helpers/fileLoader.js');
const { log } = require('../../util/helpers/log.js');
const chalk = require('chalk');
const { printTable } = require('console-table-printer');

async function loadSelectMenus(client) {
    const start = Date.now();

    const menus = new Array();

    const files = await loadFiles('Select Menus');

    for (const file of files) {
        try {
            const selectMenu = require(file);

            if (!selectMenu.id)
                menus.push({
                    SelectMenu: file.split('/').pop().slice(0, -3),
                    Status: chalk.redBright('██  '),
                    Error: 'Missing menu ID',
                });
            if (!selectMenu.execute)
                menus.push({
                    SelectMenu: file.split('/').pop().slice(0, -3),
                    Status: chalk.redBright('██  '),
                    Error: 'Missing execute function',
                });

            if (selectMenu.id && selectMenu.execute)
                menus.push({
                    SelectMenu: selectMenu.id,
                    Status: chalk.greenBright('██  '),
                });

            client.selectMenus.set(selectMenu.id, selectMenu);
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

const { loadFiles } = require('../../util/helpers/fileLoader.js');
const { log } = require('../../util/helpers/log.js');
const chalk = require('chalk');
const { printTable } = require('console-table-printer');
const path = require('path');

async function loadCommands(client) {
    const start = Date.now();

    const commands = new Array();
    const subcommands = new Array();
    const commandsArray = new Array();

    const files = await loadFiles('Commands');

    for (const file of files) {
        try {
            const command = require(file);

            if (command.subCommand) {
                const sub = command.subCommand.split('.')[1];
                const parent = command.subCommand.split('.')[0];
                subcommands.push({
                    Subcommand: sub,
                    Parent: parent,
                    Status: chalk.greenBright('██  '),
                });
                client.subCommands.set(command.subCommand, command);
                continue;
            }

            if (!command.data)
                commands.push({
                    Command: path.basename(file),
                    Status: chalk.redBright('██  '),
                    Error: 'Missing command data',
                });

            if (command.data) {
                if (!command.data.name)
                    commands.push({
                        Command: path.basename(file),
                        Status: chalk.redBright('██  '),
                        Error: 'Missing command name',
                    });
                if (
                    !command.data.description &&
                    !command.context &&
                    !command.message
                )
                    commands.push({
                        Command: path.basename(file),
                        Status: chalk.redBright('██  '),
                        Error: 'Missing command description',
                    });
            }

            if (command.data?.name) {
                client.commands.set(command.data.name, command);
                commandsArray.push(command.data.toJSON());
            }

            if (command.inDev) {
                commands.push({
                    Command: command.data.name ?? path.basename(file),
                    Status: chalk.yellow('██  '),
                });
                continue;
            }
            if (command.developer) {
                commands.push({
                    Command: command.data?.name ?? path.basename(file),
                    Status: chalk.cyan('██  '),
                });
                continue;
            }

            if (command.ignoreExecuteCheck) {
                commands.push({
                    Command: command.data.name ?? path.basename(file),
                    Status: chalk.magenta('██  '),
                });
                continue;
            }

            commands.push({
                Command: command.data.name ?? path.basename(file),
                Status: chalk.greenBright('██  '),
            });
        } catch (error) {
            log(
                chalk.bgMagentaBright.bold(' CLIENT '),
                true,
                chalk.yellow.bold(`... `),
                chalk.redBright(`ERROR while loading commands`)
            );
            console.log(error);
        }
    }

    client.application.commands.set(commandsArray);

    log(
        chalk.bgMagentaBright.bold(' CLIENT '),
        true,
        chalk.yellow.bold(`... `),
        chalk.greenBright('Loaded '),
        chalk.white.bold(`(${commands.length})`),
        ' commands in ',
        chalk.white.bold(`${Date.now() - start}ms`)
    );
    if (commands.length) printTable(commands);

    log(
        chalk.bgMagentaBright.bold(' CLIENT '),
        true,
        chalk.yellow.bold(`... `),
        chalk.greenBright('Loaded '),
        chalk.white.bold(`(${subcommands.length})`),
        ' subcommands in ',
        chalk.white.bold(`${Date.now() - start}ms`)
    );
    if (subcommands.length) printTable(subcommands);
}

module.exports = { loadCommands };

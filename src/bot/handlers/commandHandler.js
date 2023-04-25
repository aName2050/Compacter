const { loadFiles } = require('../../util/helpers/fileLoader.js');
const { log } = require('../../util/helpers/log.js');
const chalk = require('chalk');
const { printTable } = require('console-table-printer');

async function loadCommands(client) {
    const start = Date.now();

    const commands = new Array();
    const subcommands = new Array();
    const commandsArray = new Array();

    const files = await loadFiles('Commands');

    for (const file in files) {
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
                return client.subCommands.set(command.subCommand, command);
            }

            if (!command.data)
                commands.push({
                    Command: file.split('/').pop().slice(0, -3),
                    Status: chalk.redBright('██  '),
                });

            if (command.data) {
                if (!command.data.name)
                    commands.push({
                        Command: file.split('/').pop().slice(0, -3),
                        Status: chalk.redBright('██  '),
                    });
                if (
                    !command.data.description &&
                    !command.context &&
                    !command.message
                )
                    commands.push({
                        Command: file.split('/').pop().slice(0, -3),
                        Status: chalk.redBright('██  '),
                    });
            }

            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());

            if (command.inDev) {
                commands.push({
                    Command: command.data.name,
                    Status: chalk.rgb(255, 165, 0)('██  '),
                });
                continue;
            }
            if (command.developer) {
                commands.push({
                    Command: command.data.name,
                    Status: chalk.blue('██  '),
                });
                continue;
            }
            if (command.ignoreExecuteCheck) {
                commands.push({
                    Command: command.data.name,
                    Status: chalk.magenta('██  '),
                });
                continue;
            }
        } catch (error) {
            commands.push({
                Command: file.split('/').pop().slice(0, -3),
                Status: chalk.redBright('██  '),
            });
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
    printTable(commands);
    log(
        chalk.bgMagentaBright.bold(' CLIENT '),
        true,
        chalk.yellow.bold(`... `),
        chalk.greenBright('Loaded '),
        chalk.white.bold(`(${commands.length})`),
        ' subcommands in ',
        chalk.white.bold(`${Date.now() - start}ms`)
    );
    printTable(subcommands);
}

module.exports = { loadCommands };

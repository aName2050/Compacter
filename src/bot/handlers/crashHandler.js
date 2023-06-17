const { EmbedBuilder, WebhookClient, Client } = require('discord.js');
const { inspect } = require('util');
const chalk = require('chalk');
const { log } = require('../../util/helpers/log.js');
const colors = require('../../../config/colors.json');

module.exports = client => {
    log(
        chalk.bgCyan.bold(' SERVER '),
        true,
        chalk.yellow.bold('::1 '),
        'Crash handler ',
        chalk.greenBright('ready')
    );

    const webhook = new WebhookClient({
        url: require('../../../config/bot.json').ERROR_LOGGING.URL,
    });
    let embeds = [new EmbedBuilder().setColor(colors.ERROR)];

    // Discord API / Bot client error
    client.on('error', err => {
        embeds = [new EmbedBuilder().setColor(colors.ERROR)];
        log(
            chalk.bgCyan.bold(' SERVER '),
            true,
            chalk.yellow.bold('... '),
            chalk.blue('Bot Client/Discord API Error')
        );
        console.log(err);

        embeds[0]
            .setDescription(
                `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
            )
            .setTimestamp();

        return webhook.send({
            content: '# Bot Client/Discord API Error',
            embeds: embeds,
        });
    });

    // NodeJS Error: unhandledRejection
    process.on('unhandledRejection', (reason, promise) => {
        embeds = [new EmbedBuilder().setColor(colors.ERROR)];
        log(
            chalk.bgCyan.bold(' SERVER '),
            true,
            chalk.yellow.bold('... '),
            chalk.redBright('Unhandled Rejection')
        );
        console.log(reason, promise);

        embeds[0]
            .setTitle('Reason')
            .setDescription(
                `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``
            );
        embeds.push(
            new EmbedBuilder()
                .setColor(colors.ERROR)
                .setTitle('Promise')
                .setDescription(
                    `\`\`\`${inspect(promise, { depth: 0 }).slice(
                        0,
                        1000
                    )}\`\`\``
                )
                .setTimestamp()
        );

        return webhook.send({
            content: '# Unhandled Rejection',
            embeds: embeds,
        });
    });

    // NodeJS Error: uncaughtException
    process.on('uncaughtException', (err, origin) => {
        embeds = [new EmbedBuilder().setColor(colors.ERROR)];
        log(
            chalk.bgCyan.bold(' SERVER '),
            true,
            chalk.yellow.bold('... '),
            chalk.redBright('Uncaught Exception')
        );
        console.log(err, origin);

        embeds[0]
            .setTitle('Error')
            .setDescription(
                `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
            );
        embeds.push(
            new EmbedBuilder()
                .setTitle('Origin')
                .setDescription(`\`\`\`${inspect(origin, { depth: 0 })}\`\`\``)
                .setColor(colors.ERROR)
                .setTimestamp()
        );

        return webhook.send({
            content: '# Uncaught Exception',
            embeds: embeds,
        });
    });

    // NodeJS Error: uncaughtExceptionMonitor
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        embeds = [new EmbedBuilder().setColor(colors.ERROR)];
        log(
            chalk.bgCyan.bold(' SERVER '),
            true,
            chalk.yellow.bold('... '),
            chalk.redBright('Uncaught Exception')
        );
        console.log(err, origin);

        embeds[0]
            .setTitle('Error')
            .setDescription(
                `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
            );
        embeds.push(
            new EmbedBuilder()
                .setTitle('Origin')
                .setDescription(`\`\`\`${inspect(origin, { depth: 0 })}\`\`\``)
                .setColor(colors.ERROR)
                .setTimestamp()
        );

        return webhook.send({
            content: '# Uncaught Exception Monitor',
            embeds: embeds,
        });
    });

    // NodeJS Error: warning
    process.on('warning', warn => {
        embeds = [new EmbedBuilder().setColor(colors.WARNING)];
        log(
            chalk.bgCyan.bold(' SERVER '),
            true,
            chalk.yellow.bold('... '),
            chalk.yellow('Warning')
        );
        console.log(warn);

        embeds[0]
            .setDescription(
                `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``
            )
            .setTimestamp();

        return webhook.send({
            content: '# Warning',
            embeds: embeds,
        });
    });
};

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

    const createErrorMessageEmbed = (title, description) => {
        return new EmbedBuilder()
            .setColor(colors.ERROR)
            .setTitle(title)
            .setDescription(`\`\`\`${description.slice(0, 1000)}\`\`\``)
            .setTimestamp();
    };

    const sendWebhookMessage = (content, embeds) => {
        return webhook.send({
            content,
            embeds,
        });
    };

    // Discord API / Bot client error
    client.on('error', err => {
        embeds = [new EmbedBuilder().setColor(colors.ERROR)];
        log(
            chalk.bgCyan.bold(' SERVER '),
            true,
            chalk.yellow.bold('... '),
            chalk.redBright('Bot Client/Discord API Error')
        );
        console.log(err);

        embeds[0]
            .setDescription(
                `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
            )
            .setTimestamp();

        return sendWebhookMessage('# Bot Client/Discord API Error', embeds);
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

        embeds[0] = createErrorMessageEmbed(
            'Reason',
            inspect(reason, { depth: 0 })
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

        return sendWebhookMessage('# Unhandled Rejection', embeds);
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

        embeds[0] = createErrorMessageEmbed(
            'Error',
            inspect(err, { depth: 0 })
        );
        embeds.push(
            new EmbedBuilder()
                .setTitle('Origin')
                .setDescription(`\`\`\`${inspect(origin, { depth: 0 })}\`\`\``)
                .setColor(colors.ERROR)
                .setTimestamp()
        );

        return sendWebhookMessage('# Uncaught Exception', embeds);
    });

    // NodeJS Error: uncaughtExceptionMonitor
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        embeds = [new EmbedBuilder().setColor(colors.ERROR)];
        log(
            chalk.bgCyan.bold(' SERVER '),
            true,
            chalk.yellow.bold('... '),
            chalk.redBright('Uncaught Exception Monitor')
        );
        console.log(err, origin);

        embeds[0] = createErrorMessageEmbed(
            'Error',
            inspect(err, { depth: 0 })
        );
        embeds.push(
            new EmbedBuilder()
                .setTitle('Origin')
                .setDescription(`\`\`\`${inspect(origin, { depth: 0 })}\`\`\``)
                .setColor(colors.ERROR)
                .setTimestamp()
        );

        return sendWebhookMessage('# Uncaught Exception Monitor', embeds);
    });

    // NodeJS Error: warning
    process.on('warning', warn => {
        if (warn.name.includes('ExperimentalWarning')) return null;

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

        return sendWebhookMessage('# Warning', embeds);
    });
};

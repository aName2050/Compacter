const { EmbedBuilder, WebhookClient } = require('discord.js');
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
    const embed = new EmbedBuilder().setTimestamp().setColor(colors.ERROR);

    // Discord API / Bot client error
    client.on('error', err => {
        log(
            chalk.bgYellow.bold(' SERVER '),
            true,
            chalk.yellow.bold('... '),
            chalk.bold('ERROR '),
            chalk.blue('———[Bot Client/Discord API Error]———')
        );
        console.log(err);

        embed
            .setTitle('Discord Client API Error')
            .setDescription(
                `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
            );

        return webhook.send({ embeds: [embed] });
    });

    // NodeJS Error: unhandledRejection
    // NodeJS Error: uncaughtException
    // NodeJS Error: uncaughtExceptionMonitor
    // NodeJS Error: warning
};

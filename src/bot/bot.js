const chalk = require('chalk');
const { log } = require('../util/helpers/log.js');
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    Events,
} = require('discord.js');
const {
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildMessageReactions,
    MessageContent,
    GuildPresences,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildMessageReactions,
        MessageContent,
        GuildPresences,
    ],
    partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require('./Handlers/eventHandler.js');

client.config = require('../../config/static.json');
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

loadEvents(client);

require('./Handlers/crashHandler.js')(client);

// ['giveawaysys'].forEach((system) => {
// 	require(`./Systems/${system}`)(client);
// });

client
    .login(client.config['BOT-TOKEN'])
    .then(() => {
        log(
            chalk.bgMagentaBright.bold(' CLIENT '),
            true,
            chalk.yellow.bold('::1 '),
            chalk.greenBright('Logged in'),
            ' as ',
            chalk.bold(client.user.tag)
        );
    })
    .catch(err => console.log(err));

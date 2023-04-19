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

const { loadEvents } = require('./handlers/eventHandler.js');

client.config = require('../../config/bot.json');
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.errors = {
    commands: [],
    events: [],
    buttons: [],
    selectMenus: [],
    modals: [],
};

loadEvents(client);

// require('./Handlers/crashHandler')(client);
// ['giveawaysys'].forEach((system) => {
// 	require(`./Systems/${system}`)(client);
// });

client
    .login(client.config.Token)
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
    .catch((err) => console.log(err));

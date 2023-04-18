const botConfig = require('../config/bot.json');
const webConfig = require('../config/web.json');

const express = require('express');
const path = require('path');
const { request } = require('undici');
const discord = require('discord.js');
const chalk = require('chalk');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const nanoid = require('nanoid');
const bodyParser = require('body-parser');

const { PORT, REDIRECTS, COOKIE_SECRET } = webConfig;

const { sendError } = require('./util/helpers/sendError.js');
const { getPerm } = require('./util/APIs/app/dPermBigint.js');

const app = express();

// Database
connectDB();

async function connectDB() {
    if (!botConfig.MONGO_SRV)
        return console.log(chalk.redBright('ERR: MongoDB SRV missing'));

    await mongoose
        .connect(botConfig.MONGO_SRV, {})
        .then(() => {
            console.log(
                chalk.cyanBright('[SERVER] ') +
                    chalk.bold('MongoDB ') +
                    chalk.greenBright('CONNECTED')
            );
        })
        .catch((err) => {
            console.log(chalk.redBright('-- MONGODB CONNECT ERROR --'));
            console.log(err);
        });
}

mongoose.connection.on('error', (err) => {
    console.log(chalk.redBright('-- MONGODB CONNECTION ERROR --'));
    console.error(err);
});

// Middleware
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Paths
// Landing
app.get('/', (req, res) => {
    clearStateCookie(req, res);
    res.status(200).sendFile('./src/public/pages/index.html', {
        root: '.',
    });
});
// About
app.get('/about', (req, res) => {
    clearStateCookie(req, res);
    require('./server/wwwroot/routes/about/about.js').run(req, res);
});
app.get('/about/commands', (req, res) => {
    clearStateCookie(req, res);
    require('./server/wwwroot/routes/about/about-commands.js').run(req, res);
});
// Bot
app.get('/bot/invite', (req, res) => {
    clearStateCookie(req, res);
    sendError(req, res, 503);
});
app.get('/bot/support', (req, res) => {
    clearStateCookie(req, res);
    sendError(req, res, 503);
});
// Legal
app.get('/legal/tos', (req, res) => {
    clearStateCookie(req, res);
    sendError(req, res, 503);
});
app.get('/legal/privacy', (req, res) => {
    clearStateCookie(req, res);
    sendError(req, res, 503);
});
// Account management (Discord OAuth 2)
app.get('/login', (req, res) => {
    clearStateCookie(req, res);
    require('./server/wwwroot/services/login/loginroute.js').run(req, res);
});
app.get('/login/oauth/auth', (req, res) => {
    require('./server/client/Discord/auth.js').run(
        req,
        res,
        webConfig,
        botConfig
    );
});
app.get('/login/discord/oauth/redirect', (req, res) => {
    require('./server/client/Discord/OAuth2/handle.js').run(
        req,
        res,
        webConfig,
        botConfig
    );
    clearStateCookie(req, res);
});
app.get('/signout', (req, res) => {
    sendError(req, res, 503);
});
// Feedback
app.get('/feedback', (req, res) => {
    clearStateCookie(req, res);
    sendError(req, res, 503);
});
// Dashboard
app.get('/dashboard', (req, res) => res.redirect('/dashboard/guilds'));
app.get('/dashboard/guilds', (req, res) => {
    clearStateCookie(req, res);
    require('./server/wwwroot/routes/dashboard/guilds/guilds.js').run(req, res);
});
app.get('/dashboard/guilds/:id/manage', (req, res) => {
    clearStateCookie(req, res);
    require('./server/wwwroot/routes/dashboard/manage/index.js').run(req, res);
});
// APIs
app.get('/api', (req, res) => sendError(req, res, 403));
app.get('/api/get/permissions', (req, res) => {
    if (req.method == 'GET') {
        const int = getPerm(req.query.int);
        res.status(200).json(int);
    } else {
        res.status(405).json({
            err: 'Method not allowed',
            message: `${req.method} is not allowed`,
        });
    }
});
app.get('/api/get/guilds/:guildId/bot/settings', (req, res) => {});
app.get('/api/get/guilds/:guildId/channels', async (req, res) => {
    const { guildId } = req.params;
    const channels = await request(
        `https://discord.com/api/v10/guilds/${guildId}/channels`,
        {
            method: 'GET',
            headers: {
                authorization: `Bot ${botConfig.Token}`,
            },
        }
    );
    res.status(200).json(channels);
});
app.get('/api/get/guilds/:guildId/channels/:channelId', (req, res) => {
    res.sendStatus(503);
});
app.post('/api/post/cookies/set', (req, res) => {
    if (req.method != 'POST')
        return res.status(405).json({
            err: 'Method not allowed',
            message: `${req.method} is not allowed`,
        });
    if (req.headers['content-type'] != 'application/x-www-form-urlencoded')
        return res.sendStatus(415);

    const data = req.body;
    if (data.key && data.value && data.maxAge) {
        res.status(201).cookie(data.key, data.value, {
            maxAge: data.maxAge,
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: true,
        });
    } else {
        res.sendStatus(400);
    }
});

// Error handling
app.use((req, res, next) => {
    sendError(req, res, 404);
});
app.use((err, req, res, next) => {
    console.error(err);
    if (req.path.includes('api')) return res.sendStatus(500);
    sendError(req, res, 500);
});

// Bot
// require('./bot/bot.js');
const manager = new discord.ShardingManager('./src/bot/bot.js', {
    totalShards: 'auto',
    token: botConfig.Token,
    respawn: true,
});
manager.on('shardCreate', (shard) => {
    console.log(
        `${chalk.cyanBright('[SERVER]')} Bot Shard ${chalk.bold(
            `${shard.id}`
        )} ${chalk.green('ONLINE')}`
    );
});

manager.spawn();

// Listen
app.listen(PORT, () => {
    console.log(
        chalk.cyanBright('[SERVER] ') + 'Listening on port ' + chalk.bold(PORT)
    );
});

// Local functions
function clearStateCookie(req, res) {
    if (!req || !res) return undefined;
    if (req.signedCookies.stateParam) return res.clearCookie('stateParam');
}

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
const { log } = require('./util/helpers/log.js');

const app = express();

// Database
connectDB();

async function connectDB() {
    if (!botConfig.MONGO_SRV)
        return console.log(chalk.redBright('ERR: MongoDB SRV missing'));

    await mongoose
        .connect(botConfig.MONGO_SRV, {})
        .then(() => {
            log(
                chalk.bgCyan.bold(' SERVER '),
                true,
                'MongoDB Database ',
                chalk.greenBright(' CONNECTED')
            );
        })
        .catch((err) => {
            log(
                chalk.bgCyan.bold(' SERVER '),
                true,
                'MongoDB Database ',
                chalk.redBright(' Failed to connect')
            );
            console.log(err);
        });
}

mongoose.connection.on('error', (err) => {
    log(
        chalk.bgGreen.bold(' MONGO '),
        true,
        'MongoDB Database ',
        chalk.redBright(' Connection error')
    );
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
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    res.status(200).sendFile('./src/public/pages/index.html', {
        root: '.',
    });
    app.emit('httpDone', req.url, 200, req.method.toLowerCase());
});
// About
app.get('/about', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    require('./server/wwwroot/routes/about/about.js').run(req, res);
    app.emit('httpError', req.url, 503, req.method.toLowerCase());
});
app.get('/about/commands', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    require('./server/wwwroot/routes/about/about-commands.js').run(req, res);
    app.emit('httpDone', req.url, 200, req.method.toLowerCase());
});
// Bot
app.get('/bot/invite', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    sendError(req, res, 503);
    app.emit('httpError', req.url, 503, req.method.toLowerCase());
});
app.get('/bot/support', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    sendError(req, res, 503);
    app.emit('httpError', req.url, 503, req.method.toLowerCase());
});
// Legal
app.get('/legal/tos', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    sendError(req, res, 503);
    app.emit('httpError', req.url, 503, req.method.toLowerCase());
});
app.get('/legal/privacy', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    sendError(req, res, 503);
    app.emit('httpError', req.url, 503, req.method.toLowerCase());
});
// Account management (Discord OAuth 2)
app.get('/login', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    require('./server/wwwroot/services/login/loginroute.js').run(req, res);
    app.emit('httpDone', req.url, 200, req.method.toLowerCase());
});
app.get('/login/oauth/auth', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    require('./server/client/Discord/auth.js').run(
        req,
        res,
        webConfig,
        botConfig
    );
    app.emit('httpDone', req.url, 200, req.method.toLowerCase());
});
app.get('/login/discord/oauth/redirect', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    require('./server/client/Discord/OAuth2/handle.js').run(
        req,
        res,
        webConfig,
        botConfig
    );
    clearStateCookie(req, res);
    app.emit('httpDone', req.url, 200, req.method.toLowerCase());
});
app.get('/signout', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    sendError(req, res, 503);
    app.emit('httpError', req.url, 503, req.method.toLowerCase());
});
// Feedback
app.get('/feedback', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    sendError(req, res, 503);
    app.emit('httpError', req.url, 503, req.method.toLowerCase());
});
// Dashboard
app.get('/dashboard', (req, res) => res.redirect('/dashboard/guilds'));
app.get('/dashboard/guilds', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    require('./server/wwwroot/routes/dashboard/guilds/guilds.js').run(req, res);
    app.emit('httpDone', req.url, 200, req.method.toLowerCase());
});
app.get('/dashboard/guilds/:id/manage', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    clearStateCookie(req, res);
    require('./server/wwwroot/routes/dashboard/manage/index.js').run(req, res);
    app.emit('httpDone', req.url, 200, req.method.toLowerCase());
});
// APIs
app.get('/api', (req, res) => sendError(req, res, 403));
app.get('/api/get/permissions', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    if (req.method == 'GET') {
        const int = getPerm(req.query.int);
        app.emit('httpDone', req.url, 200, req.method.toLowerCase());
        res.status(200).json(int);
    } else {
        app.emit('httpError', req.url, 415, req.method.toLowerCase());
        res.status(405).json({
            err: 'Method not allowed',
            message: `${req.method} is not allowed`,
        });
    }
});
app.get('/api/get/guilds/:guildId/bot/settings', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
});
app.get('/api/get/guilds/:guildId/channels', async (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
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
    app.emit('httpDone', req.url, 200, req.method.toLowerCase());
    res.status(200).json(channels);
});
app.get('/api/get/guilds/:guildId/channels/:channelId', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    res.sendStatus(503);
    app.emit('httpError', req.url, 503, req.method.toLowerCase());
});
app.post('/api/post/cookies/set', (req, res) => {
    app.emit(req.method.toLowerCase(), req.url);
    if (req.method != 'POST') {
        app.emit('httpError', req.url, 405, req.method.toLowerCase());
        return res.status(405).json({
            err: 'Method not allowed',
            message: `${req.method} is not allowed`,
        });
    }
    if (req.headers['content-type'] != 'application/x-www-form-urlencoded') {
        app.emit('httpError', req.url, 415, req.method.toLowerCase());
        return res.sendStatus(415);
    }

    const data = req.body;
    if (data.key && data.value && data.maxAge) {
        app.emit('httpDone', req.url, 201, req.method.toLowerCase());
        res.status(201).cookie(data.key, data.value, {
            maxAge: data.maxAge,
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: true,
        });
    } else {
        app.emit('httpError', req.url, 400, req.method.toLowerCase());
        res.sendStatus(400);
    }
});

// Events
app.on('get', (route) => {
    log(
        chalk.bgBlue.bold('  HTTP  '),
        true,
        chalk.bold('... '),
        chalk.blueBright('GET '),
        chalk.blueBright(route)
    );
});
app.on('post', (route) => {
    log(
        chalk.bgBlue.bold('  HTTP  '),
        true,
        chalk.bold('... '),
        chalk.blueBright('POST '),
        chalk.blueBright(route)
    );
});
app.on('put', (route) => {
    log(
        chalk.bgBlue.bold('  HTTP  '),
        true,
        chalk.bold('... '),
        chalk.blueBright('PUT '),
        chalk.blueBright(route)
    );
});
app.on('delete', (route) => {
    log(
        chalk.bgBlue.bold('  HTTP  '),
        true,
        chalk.bold('... '),
        chalk.blueBright('DELETE '),
        chalk.blueBright(route)
    );
});
app.on('patch', (route) => {
    log(
        chalk.bgBlue.bold('  HTTP  '),
        true,
        chalk.bold('... '),
        chalk.blueBright('PATCH '),
        chalk.blueBright(route)
    );
});
app.on('httpDone', (route, code, method) => {
    log(
        chalk.bgBlue.bold('  HTTP  '),
        true,
        chalk.green.bold(`${code} `),
        chalk.blueBright(`${method.toUpperCase()} ${route}`)
    );
});

// Error handling
app.use((req, res, next) => {
    app.emit('httpError', req.url, 404, req.method.toLowerCase());
    sendError(req, res, 404);
});
app.use((err, req, res, next) => {
    app.emit('httpError', req.url, 500, req.method.toLowerCase());
    console.error(err);
    if (req.path.includes('api')) return res.sendStatus(500);
    sendError(req, res, 500);
});

app.on('httpError', (route, errCode, method) => {
    log(
        chalk.bgBlue.bold('  HTTP  '),
        true,
        chalk.red.bold(`${errCode} `),
        chalk.blueBright(`${method.toUpperCase()} ${route} `)
    );
});
// Bot
// require('./bot/bot.js');
const manager = new discord.ShardingManager('./src/bot/bot.js', {
    totalShards: 'auto',
    token: botConfig.Token,
    respawn: true,
});
manager.on('shardCreate', (shard) => {
    log(
        chalk.bgCyan.bold(' SERVER '),
        true,
        'Bot Shard ',
        chalk.bold(shard.id),
        chalk.greenBright(' ONLINE')
    );
});

manager.spawn();

// Listen
app.listen(PORT, () => {
    log(
        chalk.bgCyan.bold(' SERVER '),
        true,
        'Listening on port ',
        chalk.bold(PORT)
    );
});

// Local functions
function clearStateCookie(req, res) {
    if (!req || !res) return undefined;
    if (req.signedCookies.stateParam) return res.clearCookie('stateParam');
}

import express, { Application } from 'express';
import staticConfig from '../config/static.json';
import { LogType } from './types/log';
import logger from './util/log';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import chalk from 'chalk';

const COOKIE_SECRET: string = staticConfig.COOKIE_SECRET;

logger.log(undefined, LogType.Info, 'Starting web server...');
const app: Application = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

logger.log(undefined, LogType.Info, `Web server ${chalk.green('ready')}`);

export default app;

// start bot
import './bot/bot';

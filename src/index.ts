import privateConfig from '../config/private.json';
import staticConfig from '../config/static.json';
import colors from '../config/colors.json';
import config from '../config/config.json';

import express, { Application } from 'express';
import path from 'path';
import { Request } from 'undici';
import discord from 'discord.js';
import mongoose from 'mongoose';
import chalk from 'chalk';

import logger, { LogType } from './Util/logger';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const COOKIE_SECRET: string = privateConfig.COOKIE_SECRET;

// Server initialization and handoff
logger.log(LogType.Info, 'Starting up server...');
const app: Application = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

logger.log(LogType.Info, `Handed off control to ${chalk.blue('server.ts')}`);

export default app;
import './Server/server';

import http from './Util/helpers/http';

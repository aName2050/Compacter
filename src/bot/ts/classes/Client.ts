import { Client, Collection, GatewayIntentBits } from 'discord.js';
import IConfig from '../interfaces/IConfig';
import IClient from '../interfaces/IClient';
import logger, { LogType } from '../../../Util/logger';
import chalk from 'chalk';
import Handler from './Handler';
import Command from './Command';
import SubCommand from './SubCommand';
import { connect } from 'mongoose';

export default class BotClient extends Client implements IClient {
	handler: Handler;
	config: IConfig;
	commands: Collection<string, Command>;
	subcommands: Collection<string, SubCommand>;
	cooldowns: Collection<string, Collection<string, number>>;
	devMode: boolean;

	constructor() {
		super({ intents: [GatewayIntentBits.Guilds] });

		this.config = {
			...require(`../../../../config/static.json`),
			...require(`../../../../config/private.json`),
		};
		this.handler = new Handler(this);
		this.commands = new Collection();
		this.subcommands = new Collection();
		this.cooldowns = new Collection();
		this.devMode = process.argv.slice(2).includes('--dev');
	}

	Init(): void {
		logger.log(
			undefined,
			LogType.Info,
			`Starting bot in ${chalk.bold(
				this.devMode ? 'development' : 'production'
			)} mode.`
		);

		this.LoadHandlers();

		this.login(
			this.devMode ? this.config.BOT_TOKEN : this.config.PROD__BOT_TOKEN
		)
			.then(() =>
				logger.log(
					undefined,
					LogType.Info,
					`Logged in as ${chalk.bold(this.user?.username)}`
				)
			)
			.catch(e => {
				logger.log(
					undefined,
					LogType.Error,
					`An error occurred while logging into the bot client. Error: ${e}`
				);
				console.error(e);
			});
		// TODO: update logs
		connect(
			this.devMode
				? this.config.DEV_MONGO_URL
				: this.config.PROD__MongoURL
		)
			.then(() =>
				logger.log(
					undefined,
					LogType.MongoDB,
					`Connected to ${chalk.bold(
						this.devMode ? 'development' : 'production'
					)} database`
				)
			)
			.catch(e => {
				logger.log(
					undefined,
					LogType.MongoDB,
					'An error occurred while connecting to the database.'
				);
				logger.log(
					undefined,
					LogType.Error,
					`DatabaseConnectError: ${e}`
				);
				console.error(e);
			});
	}

	LoadHandlers(): void {
		this.handler.LoadEvents();
		this.handler.LoadCommands();
	}
}

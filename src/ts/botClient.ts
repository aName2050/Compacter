import {
	Collection,
	Client as DiscordClient,
	GatewayIntentBits,
} from 'discord.js';
import { APIHandler, Client, Configuration, Subcommand } from '../types/bot';
import EventHandler from './handler';
import SlashCommand from './command';
import { LogType } from '../types/log';
import logger from '../util/log';
import chalk from 'chalk';
import mongoose from 'mongoose';

export default class DiscordBotClient extends DiscordClient implements Client {
	public handler: APIHandler;
	public config: Configuration;
	public commands: Collection<string, SlashCommand>;
	public subcommands: Collection<string, Subcommand>;
	public cooldowns: Collection<string, Collection<string, number>>;
	public devMode: boolean;

	constructor() {
		super({ intents: [GatewayIntentBits.Guilds] });

		this.devMode = process.argv.slice(2).includes('--dev');

		this.config = {
			...require(`../../config/static.json`),
			...require(`../../config/${this.devMode ? 'local' : 'prod'}.json`),
		};

		this.handler = new EventHandler(this);
		this.commands = new Collection();
		this.subcommands = new Collection();
		this.cooldowns = new Collection();
	}

	public Init(): void {
		logger.log(
			undefined,
			LogType.Info,
			`Starting bot in ${chalk.bold(
				this.devMode ? 'development' : 'production'
			)} mode`
		);

		this.LoadHandlers();

		this.login(this.config.BOT_TOKEN)
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
					`An error occurred while logging into the bot client`
				);
				console.error(e);
			});

		mongoose
			.connect(this.config.MONGO_URL)
			.then(() => {
				logger.log(
					undefined,
					LogType.MongoDB,
					`Connected to ${
						this.devMode ? 'development' : 'production'
					} database`
				);
			})
			.catch(e => {
				logger.log(
					undefined,
					LogType.MongoDB,
					'An error occurred while connecting to the database'
				);
				logger.log(
					undefined,
					LogType.Error,
					`MongoConnectionError: ${e}`
				);
				console.error(e);
			});
	}

	public LoadHandlers(): void {
		this.handler.LoadEvents();
		this.handler.LoadCommands();
	}
}

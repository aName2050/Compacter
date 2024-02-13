import { Client } from 'discord.js';
import IConfig from '../interfaces/IConfig';
import IClient from '../interfaces/IClient';
import logger, { LogType } from '../../../Util/logger';
import chalk from 'chalk';

export default class BotClient extends Client implements IClient {
	config: IConfig;

	constructor() {
		super({ intents: [] });

		this.config = require(`../../../../config/static.json`);
	}

	Init(): void {
		this.login(this.config['BOT-TOKEN'])
			.then(() =>
				logger.log(
					undefined,
					LogType.Log,
					`Logged in as ${chalk.bold(this.user?.username)}`
				)
			)
			.catch(e =>
				logger.log(
					undefined,
					LogType.Error,
					`An error occurred while logging into the bot client. Error: ${e}`
				)
			);
	}
}

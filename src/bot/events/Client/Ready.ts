import { Collection, Events, REST, Routes } from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Event from '../../ts/classes/Event';
import logger, { LogType } from '../../../Util/logger';
import Command from '../../ts/classes/Command';
import chalk from 'chalk';

export default class Ready extends Event {
	constructor(client: BotClient) {
		super(client, {
			name: Events.ClientReady,
			description: 'Client ready event',
			once: true,
		});
	}

	async Execute() {
		logger.log(
			undefined,
			LogType.Server,
			`Client (${this.client.user?.tag}) is ready.`
		);

		const commands: object[] = this.GetJSON(this.client.commands);

		const rest = new REST().setToken(this.client.config['BOT-TOKEN']);

		const setCommands: any = await rest.put(
			Routes.applicationGuildCommands(
				this.client.config.CLIENT.ID,
				this.client.config.DEV_GUILD
			),
			{
				body: commands,
			}
		);

		logger.log(
			undefined,
			LogType.HTTP,
			`${chalk.greenBright(200)} ${chalk.blue(
				'PUT'
			)} https://discord.com/api/v10/applications/${
				this.client.config.CLIENT.ID
			}/guilds/${this.client.config.DEV_GUILD}/commands`
		);
		logger.log(
			undefined,
			LogType.Info,
			`Successfully updated commands for guild ${chalk.bold(
				this.client.config.DEV_GUILD
			)}. Updated ${setCommands.length} command(s).`
		);
	}

	private GetJSON(commands: Collection<String, Command>): object[] {
		const data: object[] = [];

		commands.forEach(command => {
			data.push({
				name: command.name,
				description: command.description,
				options: command.options,
				defualt_member_permissions:
					command.default_member_permission.toString(),
				dm_permission: command.dm_permission,
			});
		});

		return data;
	}
}

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

		const clientID = this.client.devMode
			? this.client.config.CLIENT.ID
			: this.client.config.PROD__CLIENT.ID;

		const rest = new REST().setToken(
			this.client.devMode
				? this.client.config.BOT_TOKEN
				: this.client.config.PROD__BOT_TOKEN
		);

		if (this.client.devMode) {
			const globalCommands: any = await rest.put(
				Routes.applicationCommands(clientID),
				{
					body: this.GetJSON(
						this.client.commands.filter(command => !command.dev)
					),
				}
			);

			logger.log(
				undefined,
				LogType.HTTP,
				`${chalk.greenBright('200')} ${chalk.blue(
					'PUT'
				)} https://discord.com/api/v10/applications/${chalk.bold(
					clientID
				)}/commands`
			);
			logger.log(
				undefined,
				LogType.Info,
				`Successfully loaded ${globalCommands.length} global application (/) command(s).`
			);
		}

		const devCommands: any = await rest.put(
			Routes.applicationGuildCommands(
				clientID,
				this.client.config.DEV_GUILD
			),
			{
				body: this.GetJSON(
					this.client.commands.filter(command => command.dev)
				),
			}
		);

		logger.log(
			undefined,
			LogType.HTTP,
			`${chalk.greenBright('200')} ${chalk.blue(
				'PUT'
			)} https://discord.com/api/v10/applications/${chalk.bold(
				clientID
			)}/guilds/${chalk.bold(this.client.config.DEV_GUILD)}/commands`
		);
		logger.log(
			undefined,
			LogType.Info,
			`Successfully loaded ${devCommands.length} developer application (/) command(s).`
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

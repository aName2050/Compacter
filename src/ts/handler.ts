import { glob } from 'glob';
import { Command, APIHandler, Subcommand } from '../types/bot';
import DiscordBotClient from './botClient';
import path from 'path';
import DiscordEvent from './event';
import logger from '../util/log';
import { LogType } from '../types/log';
import SlashCommand from './command';

export default class EventHandler implements APIHandler {
	client: DiscordBotClient;
	constructor(client: DiscordBotClient) {
		this.client = client;
	}

	async LoadEvents(): Promise<void> {
		const files = (await glob('src/bot/events/**/*.ts')).map(filepath =>
			path.resolve(filepath)
		);

		files.map(async (file: string) => {
			const event: DiscordEvent = new (await import(file)).default(
				this.client
			);

			if (!event.name)
				return (
					delete require.cache[require.resolve(file)] &&
					logger.log(
						undefined,
						LogType.Error,
						`${file
							.split('\\')
							.pop()} does not have an EventName assigned`
					)
				);

			const execute = (...args: any) => event.Execute(...args);

			// @ts-ignore
			if (event.once) this.client.once(event.name, execute);
			// @ts-ignore
			else this.client.on(event.name, execute);

			return delete require.cache[require.resolve(file)];
		});
	}

	async LoadCommands() {
		const files = (await glob('src/bot/commands/**/*.ts')).map(filePath =>
			path.resolve(filePath)
		);

		files.map(async (file: string) => {
			const command: Command | Subcommand = new (
				await import(file)
			).default(this.client);

			if (!command.name)
				return (
					delete require.cache[require.resolve(file)] &&
					logger.log(
						undefined,
						LogType.Error,
						`${file
							.split('\\')
							.pop()} does not have a CommandName assigned`
					)
				);

			if (file.split('/').pop()?.split('.')[2])
				return this.client.subcommands.set(
					command.name,
					command as Subcommand
				);

			this.client.commands.set(command.name, command as SlashCommand);

			return delete require.cache[require.resolve(file)];
		});
	}
}

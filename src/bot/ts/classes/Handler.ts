import { glob } from 'glob';
import IHandler from '../interfaces/IHandler';
import path from 'path';
import BotClient from './Client';
import Event from './Event';
import logger, { LogType } from '../../../Util/logger';

export default class Handler implements IHandler {
	client: BotClient;
	constructor(client: BotClient) {
		this.client = client;
	}

	async LoadEvents() {
		const files = (await glob('src/bot/events/**/*.ts')).map(filePath =>
			path.resolve(filePath)
		);

		files.map(async (file: string) => {
			const event: Event = new (await import(file)).default(this.client);

			if (!event.name)
				return (
					delete require.cache[require.resolve(file)] &&
					logger.log(
						undefined,
						LogType.Error,
						`Error: ${file
							.split('/')
							.pop()} does not have an EventName assigned.`
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
}

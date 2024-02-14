import { Events } from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Event from '../../ts/classes/Event';
import logger, { LogType } from '../../../Util/logger';

export default class Ready extends Event {
	constructor(client: BotClient) {
		super(client, {
			name: Events.ClientReady,
			description: 'Client ready event',
			once: true,
		});
	}

	Execute() {
		logger.log(
			undefined,
			LogType.Server,
			`Client (${this.client.user?.tag}) is ready.`
		);
	}
}

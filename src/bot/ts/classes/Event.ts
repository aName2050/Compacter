import { Events } from 'discord.js';
import IEvent from '../interfaces/IEvent';
import BotClient from './Client';
import IEventOptions from '../interfaces/IEventOptions';

export default class Event implements IEvent {
	client: BotClient;
	name: Events;
	description: string;
	once: boolean;

	constructor(client: BotClient, options: IEventOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description;
		this.once = options.once;
	}

	Execute(...args: any): void {}
}

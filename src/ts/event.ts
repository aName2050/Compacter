import { Events } from 'discord.js';
import { Event, EventOptions } from '../types/bot';
import DiscordBotClient from './botClient';

export default class DiscordAPIEvent implements Event {
	public client: DiscordBotClient;
	public name: Events;
	public description: string;
	public once: boolean;

	constructor(client: DiscordBotClient, options: EventOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description;
		this.once = options.once;
	}

	Execute(...args: any): void {}
}

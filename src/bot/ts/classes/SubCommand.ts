import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import ISubCommand from '../interfaces/ISubCommand';
import BotClient from './Client';
import ISubCommandOptions from '../interfaces/ISubCommandOptions';

export default class SubCommand implements ISubCommand {
	client: BotClient;
	name: string;

	constructor(client: BotClient, options: ISubCommandOptions) {
		this.client = client;
		this.name = options.name;
	}

	Execute(interaction: ChatInputCommandInteraction<CacheType>): void {}
}

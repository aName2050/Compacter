import {
	AutocompleteInteraction,
	CacheType,
	ChatInputCommandInteraction,
} from 'discord.js';
import ICommand from '../interfaces/ICommand';
import Category from '../enums/Category';
import BotClient from './Client';
import ICommandOptions from '../interfaces/ICommandOptions';

export default class Command implements ICommand {
	client: BotClient;
	name: string;
	description: string;
	category: Category;
	options: object;
	default_member_permission: bigint;
	dm_permission: boolean;
	cooldown: number;

	constructor(client: BotClient, options: ICommandOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description;
		this.category = options.category;
		this.options = options.options;
		this.default_member_permission = options.default_member_permission;
		this.dm_permission = options.dm_permission;
		this.cooldown = options.cooldown;
	}

	Execute(interaction: ChatInputCommandInteraction<CacheType>): void {}
	AutoComplete(interaction: AutocompleteInteraction<CacheType>): void {}
}

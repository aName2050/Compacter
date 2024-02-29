import {
	ApplicationCommandType,
	AutocompleteInteraction,
	CacheType,
	ChatInputCommandInteraction,
} from 'discord.js';
import ICommand from '../interfaces/ICommand';
import Category from '../enums/Category';
import BotClient from './Client';
import ICommandOptions from '../interfaces/ICommandOptions';
import { CommandOption } from '../../../types/commandOptions';

export default class Command implements ICommand {
	client: BotClient;
	name: string;
	description: string;
	category: Category;
	options: Array<CommandOption>;
	default_member_permission: bigint;
	dm_permission: boolean;
	type: ApplicationCommandType;
	cooldown: number;
	dev: boolean;

	constructor(client: BotClient, options: ICommandOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description;
		this.category = options.category;
		this.options = options.options;
		this.default_member_permission = options.default_member_permission;
		this.dm_permission = options.dm_permission;
		this.cooldown = options.cooldown;
		this.dev = options.dev;
		this.type = options.type;
	}

	Execute(interaction: ChatInputCommandInteraction<CacheType>): void {}
	AutoComplete(interaction: AutocompleteInteraction<CacheType>): void {}
}

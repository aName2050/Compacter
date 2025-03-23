import {
	ApplicationCommandType,
	AutocompleteInteraction,
	CacheType,
	ChatInputCommandInteraction,
} from 'discord.js';
import { Category, Command, CommandOption, CommandOptions } from '../types/bot';
import DiscordBotClient from './botClient';

export default class SlashCommand implements Command {
	public client: DiscordBotClient;
	public name: string;
	public description: string;
	public category: Category;
	public options: CommandOption[];
	public defaultMemberPermission: bigint;
	public DMPermission: boolean;
	public type: ApplicationCommandType;
	public cooldown: number;
	public devOnly: boolean;

	constructor(client: any, options: CommandOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description;
		this.category = options.category;
		this.options = options.options;
		this.defaultMemberPermission = options.defaultMemberPermissions;
		this.DMPermission = options.DMPermission;
		this.type = options.type;
		this.cooldown = options.cooldown;
		this.devOnly = options.devOnly;
	}

	Execute(interaction: ChatInputCommandInteraction<CacheType>): void {}
	Autocomplete(interaction: AutocompleteInteraction<CacheType>): void {}
}

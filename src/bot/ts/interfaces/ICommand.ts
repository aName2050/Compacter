import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
} from 'discord.js';
import BotClient from '../classes/Client';
import Category from '../enums/Category';

export default interface ICommand {
	client: BotClient;
	name: string;
	description: string;
	category: Category;
	options: object;
	default_member_permission: bigint;
	dm_permission: boolean;
	cooldown: number;

	Execute(interaction: ChatInputCommandInteraction): void;
	AutoComplete(interaction: AutocompleteInteraction): void;
}

import {
	ApplicationCommandType,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
} from 'discord.js';
import BotClient from '../classes/Client';
import Category from '../enums/Category';
import { CommandOption } from '../../../types/commandOptions';

export default interface ICommand {
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

	Execute(interaction: ChatInputCommandInteraction): void;
	AutoComplete(interaction: AutocompleteInteraction): void;
}

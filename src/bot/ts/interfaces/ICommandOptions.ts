import { ApplicationCommandType } from 'discord.js';
import Category from '../enums/Category';
import { CommandOption } from '../../../types/commandOptions';

export default interface ICommandOptions {
	name: string;
	description: string;
	category: Category;
	options: Array<CommandOption>;
	default_member_permission: bigint;
	dm_permission: boolean;
	type: ApplicationCommandType;

	cooldown: number;
	dev: boolean;
}

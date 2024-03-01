import { Emoji } from 'discord.js';

export default interface ISelectOption {
	label: string;
	value: string;
	description?: string;
	emoji?: Emoji;
	default?: boolean;
}

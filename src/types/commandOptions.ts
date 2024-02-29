import { ApplicationCommandOptionType, ChannelType } from 'discord.js';

export interface CommandOption {
	type: ApplicationCommandOptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: Array<{ name: string; value: string | number }>;
	options?: Array<CommandOption>;
	channel_types?: Array<ChannelType>;
	min_value?: number;
	max_value?: number;
	min_length?: number;
	max_length?: number;
	autocomplete?: boolean;
}

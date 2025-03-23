import {
	ApplicationCommandType,
	AutocompleteInteraction,
	ChannelType,
	ChatInputCommandInteraction,
	Collection,
	Events,
} from 'discord.js';
import SlashCommand from '../ts/command';
import DiscordBotClient from '../ts/botClient';

export interface Client {
	config: Configuration;
	commands: Collection<string, SlashCommand>;
	subcommands: Collection<string, Subcommand>;
	cooldowns: Collection<string, Collection<string, number>>;
	devMode: boolean;

	Init(): void;
	LoadHandlers(): void;
}

export interface Configuration {
	BOT_TOKEN: string;
	CLIENT: {
		SECRET: string;
		ID: string;
	};
	DEV_GUILD: string;
	DEVELOPERS: string[];
	MONGO_URL: string;
}

export interface Command {
	// client: DiscordBotClient;
	name: string;
	description: string;
	category: Category;
	options: CommandOption[];
	defaultMemberPermission: bigint;
	DMPermission: boolean;
	type: ApplicationCommandType;
	cooldown: number;
	devOnly: boolean;

	Execute(interaction: ChatInputCommandInteraction): void;
	Autocomplete(interaction: AutocompleteInteraction): void;
}

export enum Category {
	DEV_TOOLS = 'DEV_TOOLS',
	Moderation = 'Moderation',
	Utility = 'Utility',
	Settings = 'Settings',
	Tools = 'Tools',
}

export interface CommandOption {
	type: ApplicationCommandType;
	name: string;
	description: string;
	required?: boolean;
	choices?: Array<{ name: string; value: string | number }>;
	options?: CommandOption[];
	channelTypes?: ChannelType[];
	minValue?: number;
	maxValue?: number;
	minLength?: number;
	maxLength?: number;
	autocomplete?: boolean;
}

export interface CommandOptions {
	name: string;
	description: string;
	category: Category;
	options: CommandOption[];
	defaultMemberPermissions: bigint;
	DMPermission: boolean;
	type: ApplicationCommandType;
	cooldown: number;
	devOnly: boolean;
}

export interface Subcommand {
	client: DiscordBotClient;
	name: string;

	Execute(interaction: ChatInputCommandInteraction): void;
}

export interface APIHandler {
	LoadEvents(): void;
	LoadCommands(): void;
}

export interface Event {
	client: DiscordBotClient;
	name: Events;
	description: string;
	once: boolean;
}

export interface EventOptions {
	name: Events;
	description: string;
	once: boolean;
}

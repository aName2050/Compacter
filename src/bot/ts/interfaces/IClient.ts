import { Collection } from 'discord.js';
import IConfig from './IConfig';
import Command from '../classes/Command';
import SubCommand from '../classes/SubCommand';

export default interface IClient {
	config: IConfig;
	commands: Collection<string, Command>;
	subcommands: Collection<string, SubCommand>;
	cooldowns: Collection<string, Collection<string, number>>;
	devMode: boolean;

	Init(): void;
	LoadHandlers(): void;
}

import { ChatInputCommandInteraction } from 'discord.js';
import BotClient from '../classes/Client';

export default interface ISubCommand {
	client: BotClient;
	name: string;

	Execute(interaction: ChatInputCommandInteraction): void;
}

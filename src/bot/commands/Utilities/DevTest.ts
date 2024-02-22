import {
	CacheType,
	ChatInputCommandInteraction,
	PermissionsBitField,
} from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Command from '../../ts/classes/Command';
import Category from '../../ts/enums/Category';

export default class Test extends Command {
	constructor(client: BotClient) {
		super(client, {
			name: 'dev',
			description: 'Test command for dev',
			category: Category.Utilities,
			default_member_permission:
				PermissionsBitField.Flags.UseApplicationCommands,
			dm_permission: false,
			cooldown: 3,
			options: [],
			dev: true,
		});
	}

	Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
		throw new Error(
			'Promise<T> is not an expected type, expected Array<T>'
		);
		interaction.reply({ content: 'Hello dev!', ephemeral: true });
	}
}

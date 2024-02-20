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
			name: 'test',
			description: 'Test command',
			category: Category.Utilities,
			default_member_permission:
				PermissionsBitField.Flags.UseApplicationCommands,
			dm_permission: false,
			cooldown: 3,
			options: [],
		});
	}

	Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
		interaction.reply({ content: 'Hello world!', ephemeral: true });
	}
}

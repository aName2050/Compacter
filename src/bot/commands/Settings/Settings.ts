import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Command from '../../ts/classes/Command';
import Category from '../../ts/enums/Category';

export default class Settings extends Command {
	constructor(client: BotClient) {
		super(client, {
			name: 'settings',
			description: 'Configure settings for this server',
			category: Category.Settings,
			default_member_permission: PermissionFlagsBits.ManageGuild,
			dm_permission: false,
			dev: false,
			cooldown: 3,
			options: [
				{
					name: 'plugins',
					description: 'Configure plugins for this server',
					type: ApplicationCommandOptionType.SubcommandGroup,
					options: [
						{
							name: 'toggle',
							description:
								'Enable and disable plugins for this server',
							type: ApplicationCommandOptionType.Subcommand,
							options: [
								{
									name: 'plugin',
									description:
										'The plugin you want to configure',
									type: ApplicationCommandOptionType.String,
									required: true,
								},
								{
									name: 'enabled',
									description:
										'Enable or disable this plugin',
									type: ApplicationCommandOptionType.Boolean,
									required: true,
								},
							],
						},
						{
							name: 'configure',
							description: 'Configure a plugin for this server',
							type: ApplicationCommandOptionType.Subcommand,
							options: [
								{
									name: 'plugin',
									description:
										'The plugin you want to configure',
									type: ApplicationCommandOptionType.String,
									required: true,
								},
							],
						},
					],
				},
			],
		});
	}
}

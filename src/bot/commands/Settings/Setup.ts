import {
	ApplicationCommandOptionType,
	ChannelType,
	PermissionFlagsBits,
} from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Command from '../../ts/classes/Command';
import Category from '../../ts/enums/Category';

export default class Settings extends Command {
	constructor(client: BotClient) {
		super(client, {
			name: 'setup',
			description:
				'Quickly setup your server. You can also quickly change plugin settings here',
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
							name: 'logs',
							description: 'Configure logging for this server',
							type: ApplicationCommandOptionType.Subcommand,
							options: [
								{
									name: 'plugin',
									description:
										'The plugin you want to configure logging for. This will enable the plugin!',
									type: ApplicationCommandOptionType.String,
									choices: [
										{
											name: 'Moderation',
											value: 'plugins.moderation',
										},
									],
									required: true,
								},
								{
									name: 'channel',
									description:
										'The channel logs should be sent to for this plugin',
									type: ApplicationCommandOptionType.Channel,
									channel_types: [ChannelType.GuildText],
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

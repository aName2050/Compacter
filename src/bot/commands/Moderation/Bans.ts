import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Command from '../../ts/classes/Command';
import Category from '../../ts/enums/Category';

export default class Ban extends Command {
	constructor(client: BotClient) {
		super(client, {
			name: 'bans',
			description: 'Manage bans for this server',
			category: Category.Moderation,
			default_member_permission: PermissionFlagsBits.BanMembers,
			dm_permission: false,
			cooldown: 3,
			dev: false,
			options: [
				{
					name: 'add',
					description: 'Ban a user from this server',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'user',
							description: 'Select a user you want to ban',
							type: ApplicationCommandOptionType.User,
							required: true,
						},
						{
							name: 'reason',
							description: 'Why are you banning this user?',
							type: ApplicationCommandOptionType.String,
							min_value: 10,
							max_value: 512,
							required: true,
						},
						{
							name: 'user_messages',
							description:
								'What messages should we delete from this user?',
							type: ApplicationCommandOptionType.String,
							required: false,
							choices: [
								{ name: 'None', value: '0' },
								{ name: 'From the last 24 hours', value: '1d' },
								{
									name: 'From the last week (7 days)',
									value: '7d',
								},
							],
						},
						{
							name: 'silent',
							description:
								"Don't send a message in the current channel",
							type: ApplicationCommandOptionType.Boolean,
							required: false,
						},
					],
				},
				{
					name: 'remove',
					description: 'Unban a user from this server',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'userid',
							description:
								'Provide the user ID of the user you want to unban',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
						{
							name: 'reason',
							description: 'Why are you unbanning this user?',
							type: ApplicationCommandOptionType.String,
							min_value: 10,
							max_value: 512,
							required: true,
						},
						{
							name: 'silent',
							description:
								"Don't send a message in the current channel",
							type: ApplicationCommandOptionType.Boolean,
							required: false,
						},
					],
				},
			],
		});
	}
}

import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	CacheType,
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedBuilder,
	GuildMember,
	GuildMemberRoleManager,
	PermissionFlagsBits,
} from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Command from '../../ts/classes/Command';
import Category from '../../ts/enums/Category';
import * as Colors from '../../../../config/colors.json';

export default class Kick extends Command {
	constructor(client: BotClient) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'kick',
			description: 'Kick a user from this server',
			category: Category.Moderation,
			default_member_permission: PermissionFlagsBits.KickMembers,
			dm_permission: false,
			dev: false,
			cooldown: 3,
			options: [
				{
					name: 'user',
					description: 'Select a user you want to kick',
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: 'reason',
					description: 'Why are you kicking this user?',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'silent',
					description: "Don't send a message in the current channel",
					type: ApplicationCommandOptionType.Boolean,
					required: false,
				},
			],
		});
	}

	async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
		const user = interaction.options.getMember('user') as GuildMember;
		const reason = interaction.options.getString('reason');
		const silent = interaction.options.getBoolean('silent') || false;

		const errorEmbed = new EmbedBuilder().setColor(
			Colors.ERROR as ColorResolvable
		);

		if (!user)
			return interaction.reply({
				embeds: [
					errorEmbed
						.setTitle('❌  Unable to kick this user')
						.setDescription(
							'The user you selected is not a valid user, please try again.'
						),
				],
				ephemeral: true,
			});

		if (user.id == interaction.user.id)
			return interaction.reply({
				embeds: [
					errorEmbed
						.setTitle('❌  Unable to kick this user')
						.setDescription("You can't kick yourself!"),
				],
				ephemeral: true,
			});

		if (
			user.roles.highest.position >=
			(interaction.member?.roles as GuildMemberRoleManager).highest
				.position
		)
			return interaction.reply({
				embeds: [
					errorEmbed
						.setTitle('❌  Unable to kick this user')
						.setDescription(
							'The user you selected has a higher or equal role(s).'
						),
				],
				ephemeral: true,
			});

		// TODO:
	}
}

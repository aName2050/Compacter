import {
	ChatInputCommandInteraction,
	CacheType,
	GuildMember,
	EmbedBuilder,
	ColorResolvable,
	GuildMemberRoleManager,
} from 'discord.js';
import BotClient from '../../ts/classes/Client';
import SubCommand from '../../ts/classes/SubCommand';
import Colors from '../../../../config/colors.json';

export default class BansAdd extends SubCommand {
	constructor(client: BotClient) {
		super(client, {
			name: 'bans.add',
		});
	}

	async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
		const target = interaction.options.getMember('target') as GuildMember;
		const reason = interaction.options.getString('reason')!;
		const messagesAge =
			interaction.options.getString('user_messages') || '0';
		const silent = interaction.options.getBoolean('silent') || false;

		const errorEmbed = new EmbedBuilder().setColor(
			Colors.ERROR as ColorResolvable
		);

		if (!target)
			return interaction.reply({
				embeds: [
					errorEmbed
						.setTitle('❌  Cannot ban this user')
						.setDescription(
							'The user you selected is not a valid user, please try again.'
						),
				],
				ephemeral: true,
			});

		if (target.id == interaction.user.id)
			return interaction.reply({
				embeds: [
					errorEmbed
						.setTitle('❌  Cannot ban this user')
						.setDescription("You can't ban yourself!"),
				],
				ephemeral: true,
			});

		if (
			target.roles.highest.position >=
			(interaction.member?.roles as GuildMemberRoleManager).highest
				.position
		)
			return interaction.reply({
				embeds: [
					errorEmbed
						.setTitle('❌  Cannot ban this user')
						.setDescription(
							'The user you selected has a higher or equal role(s).'
						),
				],
				ephemeral: true,
			});

		if (!target.bannable)
			return interaction.reply({
				embeds: [
					errorEmbed
						.setTitle('❌  Cannot ban this user')
						.setDescription('This user cannot be banned'),
				],
				ephemeral: true,
			});
	}
}

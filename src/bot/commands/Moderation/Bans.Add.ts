import {
	ChatInputCommandInteraction,
	CacheType,
	GuildMember,
	EmbedBuilder,
	ColorResolvable,
	GuildMemberRoleManager,
	TextChannel,
} from 'discord.js';
import ms from 'ms';
import BotClient from '../../ts/classes/Client';
import SubCommand from '../../ts/classes/SubCommand';
import Colors from '../../../../config/colors.json';
import GuildConfig from '../../mongodb/schemas/GuildConfig';

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

		target
			.send({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.DANGER as ColorResolvable)
						.setDescription(
							`
					You **banned** from \`${interaction.guild?.name}\` by ${interaction.member}.
					You were banned for
					\`\`\`txt
					${reason}
					\`\`\`
					`
						)
						.setFooter({
							text: 'To appeal, contact the moderator who banned you.',
						})
						.setImage(interaction.guild?.iconURL()!),
				],
			})
			.catch();

		try {
			await target.ban({
				deleteMessageSeconds: ms(messagesAge),
				reason,
			});
		} catch (e) {
			return interaction.reply({
				embeds: [
					errorEmbed
						.setTitle('❌  Cannot ban this user')
						.setDescription(
							`An unexpected error occurred while trying to ban this user
							\`\`\`yaml
							${e}
							\`\`\``
						),
				],
			});
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.EMBED_INVIS_SIDEBAR as ColorResolvable)
					.setTitle('🔨  Member Banned')
					.setDescription(
						`${target} was banned by ${interaction.member} for
				\`\`\`txt
				${reason}
				\`\`\`
				${
					messagesAge == '0'
						? ''
						: `Messages sent by this user from the last **${messagesAge}** have been deleted.`
				}`
					)
					.setFooter({ text: `USER_ID: ${target.id}` })
					.setImage(
						target.displayAvatarURL({
							size: 512,
							forceStatic: false,
						})
					),
			],
			ephemeral: true,
		});

		if (!silent)
			interaction.channel
				?.send({
					embeds: [
						new EmbedBuilder()
							.setColor(
								Colors.EMBED_INVIS_SIDEBAR as ColorResolvable
							)
							.setAuthor({
								name: 'Member Banned',
								iconURL: interaction.user.displayAvatarURL({
									size: 64,
									forceStatic: false,
								})!,
							})
							.setDescription(
								`
						## Reason
						\`\`\`txt
						${reason}
						\`\`\`
						`
							)
							.setFooter({
								text: 'Some info may not be available here to protect user privacy.',
							}),
					],
				})
				.then(msg => {
					setTimeout(async () => await msg.delete(), 1000 * 30);
				});

		const guild = await GuildConfig.findOne({
			guildId: interaction.guildId,
		});

		if (
			guild &&
			guild.plugins.moderation.enabled &&
			guild.plugins.moderation.logChannelID
		)
			(
				(await interaction.guild?.channels.fetch(
					guild.plugins.moderation.logChannelID
				)) as TextChannel
			).send({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.EMBED_INVIS_SIDEBAR as ColorResolvable)
						.setTitle('🔨  Member Banned')
						.setDescription(
							`${target} was banned by ${interaction.member} for
				\`\`\`txt
				${reason}
				\`\`\`
				${
					messagesAge == '0'
						? ''
						: `Messages sent by this user from the last **${messagesAge}** have been deleted.`
				}`
						)
						.setFooter({ text: `USER_ID: ${target.id}` })
						.setImage(
							target.displayAvatarURL({
								size: 512,
								forceStatic: false,
							})
						)
						.setTimestamp(),
				],
			});
	}
}

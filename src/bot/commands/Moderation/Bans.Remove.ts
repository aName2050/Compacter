import {
	ChatInputCommandInteraction,
	CacheType,
	EmbedBuilder,
	ColorResolvable,
	TextChannel,
} from 'discord.js';
import BotClient from '../../ts/classes/Client';
import SubCommand from '../../ts/classes/SubCommand';
import Colors from '../../../../config/colors.json';
import GuildConfig from '../../mongodb/schemas/GuildConfig';

export default class BansRemove extends SubCommand {
	constructor(client: BotClient) {
		super(client, {
			name: 'bans.remove',
		});
	}

	async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
		const target = interaction.options.getString('target')!;
		const reason = interaction.options.getString('reason')!;
		const silent = interaction.options.getBoolean('silent') || false;

		const errorEmbed = new EmbedBuilder().setColor(
			Colors.ERROR as ColorResolvable
		);

		try {
			await interaction.guild?.bans.fetch(target);
		} catch (e) {
			return interaction.reply({
				embeds: [
					errorEmbed.setTitle('❌  Cannot unban this user')
						.setDescription(`An unexpected occurred while unbanning this user.
                        \`\`\`yaml
                        ${e}
                        \`\`\``),
				],
				ephemeral: true,
			});
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.EMBED_INVIS_SIDEBAR as ColorResolvable)
					.setTitle('🔨  Member Unbanned')
					.setDescription(
						`${target} was unbanned by ${interaction.member} with the reason
				\`\`\`txt
				${reason}
				\`\`\``
					)
					.setFooter({ text: `USER_ID: ${target}` }),
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
								name: 'Member Unbanned',
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
						.setTitle('🔨  Member Unbanned')
						.setDescription(
							`${target} was unbanned by ${interaction.member} with the reason
				\`\`\`txt
				${reason}
				\`\`\``
						)
						.setFooter({ text: `USER_ID: ${target}` })
						.setTimestamp(),
				],
			});
	}
}

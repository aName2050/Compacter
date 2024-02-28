import {
	ChatInputCommandInteraction,
	CacheType,
	TextChannel,
	EmbedBuilder,
	ColorResolvable,
} from 'discord.js';
import BotClient from '../../ts/classes/Client';
import SubCommand from '../../ts/classes/SubCommand';
import Colors from '../../../../config/colors.json';
import GuildConfig from '../../mongodb/schemas/GuildConfig';
import generateGuildConfig from '../../../Util/helpers/generateGuildConfig';

export default class SetupPluginsLogs extends SubCommand {
	constructor(client: BotClient) {
		super(client, {
			name: 'settings.plugins.toggle',
		});
	}

	async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
		const plugin = interaction.options
			.getString('plugin')!
			.toLowerCase()
			.split('.')[1];
		const enabled = interaction.options.getBoolean('enabled') || false;

		await interaction.deferReply({ ephemeral: true });

		try {
			let guild = await GuildConfig.findOne({
				guildId: interaction.guildId,
			});

			if (!guild) guild = await generateGuildConfig(interaction.guildId!);

			//@ts-ignore
			const oldValue = guild.plugins[`${plugin}`]?.enabled;
			//@ts-ignore
			guild.plugins[`${plugin}`].enabled = enabled;

			await guild.save();

			return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.SUCCESS as ColorResolvable)
						.setTitle('✔️ Plugin configured')
						.setDescription(
							`The plugin \`${plugin}\` was successfully modified.\n\n**Logging for this plugin has changed**\nChanged from...\n - Enabled?=${oldValue}\nTo...\n - Enabled?=${
								//@ts-ignore
								guild.plugins[`${plugin}`].enabled
							}`
						),
				],
			});
		} catch (e) {
			console.error(e);
			return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.ERROR as ColorResolvable)
						.setTitle('❌ Unable to configure plugin')
						.setDescription(
							`An unexpected error occurred while trying to modify this plugin.\n\`\`\`yaml\n${e}\n\`\`\``
						),
				],
			});
		}
	}
}

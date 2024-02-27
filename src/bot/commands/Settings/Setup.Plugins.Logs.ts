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

export default class SetupPluginsLogs extends SubCommand {
	constructor(client: BotClient) {
		super(client, {
			name: 'setup.plugins.logs',
		});
	}

	async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
		const plugin = interaction.options.getString('plugin');
		const channel = interaction.options.getChannel(
			'channel'
		) as TextChannel;

		await interaction.deferReply({ ephemeral: true });

		try {
			let guild = await GuildConfig.findOne({
				guildId: interaction.guildId,
			});

			if (!guild)
				guild = await GuildConfig.create({
					guildId: interaction.guildId,
				});

			//@ts-ignore
			const oldValue: string = guild.plugins[`${plugin}`].logChannelID;
			//@ts-ignore
			guild.plugins[`${plugin}`].logChannelID = channel.id;

			//prettier-ignore
			//@ts-ignore
			const pluginAlreadyEnabled: boolean = guild.plugins[`${plugin}`].enabled;

			//@ts-ignore
			guild.plugins[`${plugin}`].enabled = true;

			await guild.save();

			return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.SUCCESS as ColorResolvable)
						.setTitle('✔️ Plugin configured')
						.setDescription(
							`The plugin \`${plugin}\` was successfully modified.\n\n**Logging for this plugin has changed**\nChanged from...\n - <#${oldValue}>\nTo...\n - <#${
								guild.plugins.moderation.logChannelID
							}>
                            ${
								pluginAlreadyEnabled
									? ''
									: '\n\nThis plugin was automatically enabled for this server.'
							}
                            `
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

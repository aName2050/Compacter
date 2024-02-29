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
			name: 'settings.plugins.configure',
		});
	}

	Execute(interaction: ChatInputCommandInteraction<CacheType>) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('🍲  Command still cooking')
					.setDescription(
						"Sorry! We're still cooking up this command!"
					)
					.setColor(Colors.ERROR as ColorResolvable),
			],
			ephemeral: true,
		});
	}
}

import { ColorResolvable, EmbedBuilder, Events, Guild } from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Event from '../../ts/classes/Event';
import GuildConfig from '../../mongodb/schemas/GuildConfig';
import logger, { LogType } from '../../../Util/logger';
import chalk from 'chalk';
import * as Colors from '../../../../config/colors.json';

export default class GuildDelete extends Event {
	constructor(client: BotClient) {
		super(client, {
			name: Events.GuildDelete,
			description: 'Guild leave event',
			once: false,
		});
	}

	async Execute(guild: Guild) {
		try {
			await GuildConfig.deleteOne({ guildId: guild.id });
		} catch (e) {
			logger.log(
				undefined,
				LogType.Error,
				`An unexpected error occurred while deleting GuildConfig for guild with ID ${chalk.bold(
					guild.id
				)}`
			);
			console.error(e);
		}

		logger.log(
			undefined,
			LogType.Log,
			`Bot removed from server. ${chalk.bold(guild.name)} - ${guild.id}`
		);
		logger.log(
			undefined,
			LogType.MongoDB,
			`GuildConfig deleted for guild with ID ${chalk.bold(guild.id)}`
		);

		const owner = await guild.fetchOwner();
		owner
			?.send({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.EMBED_INVIS_SIDEBAR as ColorResolvable)
						.setDescription(
							"We're sorry to see you go! Feel free to provide feedback on how we can improve in our support server.\n\nWe hope you return soon!"
						),
				],
			})
			.catch();
	}
}

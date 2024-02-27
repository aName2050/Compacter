import { ColorResolvable, EmbedBuilder, Events, Guild } from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Event from '../../ts/classes/Event';
import GuildConfig from '../../mongodb/schemas/GuildConfig';
import * as Colors from '../../../../config/colors.json';
import logger, { LogType } from '../../../Util/logger';
import chalk from 'chalk';

export default class GuildCreate extends Event {
	constructor(client: BotClient) {
		super(client, {
			name: Events.GuildCreate,
			description: 'Guild join event',
			once: false,
		});
	}

	async Execute(guild: Guild) {
		try {
			if (!(await GuildConfig.exists({ guildId: guild.id })))
				await GuildConfig.create({ guildId: guild.id });
		} catch (e) {
			logger.log(
				undefined,
				LogType.Error,
				'An unexpected error occurred while created a new GuildConfig.'
			);
			console.error(e);
		}

		logger.log(
			undefined,
			LogType.Log,
			`Bot added to new server. ${chalk.bold(guild.name)} - ${guild.id}`
		);
		logger.log(
			undefined,
			LogType.MongoDB,
			`New GuildConfig created for guild with ID ${chalk.bold(guild.id)}`
		);

		const owner = await guild.fetchOwner();
		owner
			?.send({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.SUCCESS as ColorResolvable)
						.setDescription(
							'Thanks for inviting **Compacter** to your server!\n\nTo setup **Compacter** quickly and take advantage of all its features, or quickly change common settings, run `/setup` in your server. To edit settings and access more specific settings, run `/settings`.'
						),
				],
			})
			.catch();
	}
}

import {
	ChatInputCommandInteraction,
	Collection,
	ColorResolvable,
	EmbedBuilder,
	Events,
} from 'discord.js';
import BotClient from '../../ts/classes/Client';
import Event from '../../ts/classes/Event';
import Command from '../../ts/classes/Command';
import * as Colors from '../../../../config/colors.json';
import logger, { LogType } from '../../../Util/logger';
import chalk from 'chalk';

export default class CommandHandler extends Event {
	constructor(client: BotClient) {
		super(client, {
			name: Events.InteractionCreate,
			description: 'Command handler event',
			once: false,
		});
	}

	async Execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const command: Command = this.client.commands.get(
			interaction.commandName
		)!;

		if (!command)
			//@ts-ignore
			return (
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.ERROR as ColorResolvable)
							.setDescription(
								'An error occurred while running this command.```yaml\nError: This command does not exist.\n```'
								// \n[Learn more](https://compacter.xyz/support/errors/command-does-not-exist)
							)
							.setTimestamp(),
					],
					ephemeral: true,
				}),
				this.client.commands.delete(interaction.commandName)
			);

		if (
			command.dev &&
			!this.client.config.DEVELOPERS.includes(interaction.user.id)
		)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.ERROR as ColorResolvable)
						.setTitle('🧑‍💻 Developer Command')
						.setDescription(
							'This command is reserved for the developers of this bot to use.'
							// + '\n[Learn more](https://compacter.xyz/support/errors/dev-cmd)'
						),
				],
				ephemeral: true,
			});

		const { cooldowns } = this.client;
		if (!cooldowns.has(command.name))
			cooldowns.set(command.name, new Collection());

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (
			timestamps?.has(interaction.user.id) &&
			now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount
		)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.INFO as ColorResolvable)
						.setTitle('⏳ Command on cooldown!')
						.setDescription(
							`You can\'t use this command for another \`${(
								((timestamps.get(interaction.user.id) || 0) +
									cooldownAmount -
									now) /
								1000
							).toFixed(1)}\` seconds.`
							// \n[Learn more](https://compacter.xyz/support/commands/command-cooldowns)
						),
				],
				ephemeral: true,
			});

		timestamps?.set(interaction.user.id, now);
		setTimeout(
			() => timestamps?.delete(interaction.user.id),
			cooldownAmount
		);

		const subCommandGroup = interaction.options.getSubcommandGroup(false);
		const subCommand = `${interaction.commandName}${
			subCommandGroup ? `.${subCommandGroup}` : ''
		}.${interaction.options.getSubcommand(false) || ''}`;

		try {
			logger.log(
				undefined,
				LogType.Command,
				`Running application (/) command "${chalk.bold(
					this.client.subcommands.get(subCommand)?.name ||
						command.name
				)}"`
			);

			return (
				this.client.subcommands.get(subCommand)?.Execute(interaction) ||
				command.Execute(interaction)
			);
		} catch (e) {
			logger.log(
				undefined,
				LogType.Command,
				`${chalk.redBright(
					'Failed'
				)} running application (/) command "${chalk.bold(
					this.client.subcommands.get(subCommand)?.name ||
						command.name
				)}"`
			);
			logger.log(
				undefined,
				LogType.Error,
				`${chalk.redBright('CommandError:')} ${e}`
			);
			console.error(e);
			logger.log(undefined, LogType.Log, 'Recovering...');
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.ERROR as ColorResolvable)
						.setDescription(
							`An error occurred while running this command.\`\`\`yaml\n${e}\n\`\`\``
							// \n[Report this error](https://compacter.xyz/feedback/report-an-error)
						),
				],
				ephemeral: true,
			});
		}
	}
}

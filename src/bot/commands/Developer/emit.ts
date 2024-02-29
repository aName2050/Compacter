import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	CacheType,
	ChatInputCommandInteraction,
	ColorResolvable,
	EmbedBuilder,
	Events,
	Guild,
	PermissionsBitField,
} from 'discord.js';
import Command from '../../ts/classes/Command';
import Event from '../../ts/classes/Event';
import Category from '../../ts/enums/Category';
import * as Colors from '../../../../config/colors.json';
import BotClient from '../../ts/classes/Client';

export default class Emit extends Command {
	constructor(client: BotClient) {
		super(client, {
			name: 'emit',
			description: 'Emit an event',
			dev: true,
			default_member_permission: PermissionsBitField.Flags.Administrator,
			dm_permission: false,
			category: Category.Developer,
			cooldown: 1,
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: 'event',
					description: 'The event to emit',
					required: true,
					type: ApplicationCommandOptionType.String,
					choices: [
						{ name: 'GuildCreate', value: Events.GuildCreate },
						{ name: 'GuildDelete', value: Events.GuildDelete },
					],
				},
			],
		});
	}

	Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
		const event = interaction.options.getString('event');

		if (event == Events.GuildCreate || event == Events.GuildDelete) {
			this.client.emit(event, interaction.guild as Guild);
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.SUCCESS as ColorResolvable)
					.setDescription(`Emitted event - \`${event}\``),
			],
			ephemeral: true,
		});
	}
}

import GuildConfig from '../../bot/mongodb/schemas/GuildConfig';

export default async function generateGuildConfig(guildID: string) {
	const guild = await GuildConfig.create({
		guildId: guildID,
		plugins: {
			moderation: {
				enabled: false,
				logChannelID: '',
			},
		},
	});

	return guild;
}

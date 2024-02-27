import { Schema, model } from 'mongoose';

interface IGuildConfig {
	guildId: string;
	plugins: {
		moderation: {
			enabled: boolean;
			logChannelID: string;
		};
	};
}

export default model<IGuildConfig>(
	'GuildConfig',
	new Schema<IGuildConfig>(
		{
			guildId: String,
			plugins: {
				moderation: {
					enabled: Boolean,
					logChannelID: String,
				},
			},
		},
		{
			timestamps: true,
		}
	)
);

export default interface IConfig {
	// CompacterBeta (TESTING)
	BOT_TOKEN: string;
	CLIENT: { SECRET: string; ID: string };
	DEV_GUILD: string;
	DEVELOPERS: string[];
	DEV_MONGO_URL: string;
	// Compacter (PRODUCTION)
	PROD__BOT_TOKEN: string;
	PROD__CLIENT: { SECRET: string; ID: string };
	PROD__MongoURL: string;
}

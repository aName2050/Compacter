import IConfig from './IConfig';

export default interface IClient {
	config: IConfig;

	Init(): void;
}

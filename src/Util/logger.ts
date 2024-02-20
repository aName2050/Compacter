import chalk from 'chalk';
import http from './helpers/http';

class Logger {
	/**
	 *
	 * @param req Set to undefined if not including Request object, defualts to local IP
	 * @param type The log type
	 * @param args The stuff to log
	 */
	public log(req: any = undefined, type: LogType, ...args: any[]) {
		// Timestamp
		const now: Date = new Date();
		let day: number | string,
			month: number | string,
			year: number,
			hour: number | string,
			minute: number | string,
			second: number | string,
			ms: number | string;
		day = (now.getDate() + '').padStart(2, '0');
		month = (now.getMonth() + 1 + '').padStart(2, '0');
		year = now.getFullYear();
		hour = (now.getHours() + '').padStart(2, '0');
		minute = (now.getMinutes() + '').padStart(2, '0');
		second = (now.getSeconds() + '').padStart(2, '0');
		ms = (now.getMilliseconds() + '').padStart(3, '0');
		const timestamp: string = `${month}/${day}/${year} ${hour}:${minute}:${second}.${ms}`;
		const ip: string = chalk.yellow(`${req ? http.getIP(req) : '::1\t'}`);

		// Log data
		let data: string = '';
		switch (type) {
			case LogType.Log:
				{
					data = chalk.white(' LOG \t');
				}
				break;
			case LogType.Error:
				{
					data = chalk.redBright(' ERROR \t');
				}
				break;
			case LogType.HTTP:
				{
					data = chalk.blue(' HTTP \t');
				}
				break;
			case LogType.Info:
				{
					data = chalk.cyanBright(' INFO \t');
				}
				break;
			case LogType.Server:
				{
					data = chalk.cyan(' SERVER ');
				}
				break;
			case LogType.Command:
				{
					data = chalk.yellowBright(' COMMAND');
				}
				break;
			case LogType.MongoDB:
				{
					data = chalk.greenBright(' MONGODB');
				}
				break;

			default:
				{
					data = chalk.white(' LOG \t');
				}
				break;
		}
		// Output log
		console.log(timestamp, data, `${ip}\t`, args.join(''));
	}
}

enum LogType {
	Error = 0,
	Info = 1,
	Server = 2,
	HTTP = 3,
	Command = 4,
	Log = 5,
	MongoDB = 6,
}

export default new Logger();
export { LogType, Logger };

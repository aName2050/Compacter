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
        let day: number,
            month: number,
            year: number,
            hour: number | string,
            minute: number | string,
            second: number | string,
            ms: number | string;
        day = now.getDate();
        month = now.getMonth() + 1;
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
                    data = ' LOG \t';
                }
                break;
            case LogType.Error:
                {
                    data = ' ERROR \t';
                }
                break;
            case LogType.HTTP:
                {
                    data = ' HTTP \t';
                }
                break;
            case LogType.Info:
                {
                    data = ' INFO \t';
                }
                break;
            case LogType.Server:
                {
                    data = ' SERVER ';
                }
                break;
            case LogType.Command:
                {
                    data = ' COMMAND';
                }
                break;
            case LogType.MongoDB:
                {
                    data = ' MONGODB';
                }
                break;

            default:
                {
                    data = ' LOG \t';
                }
                break;
        }
        // Output log
        console.log(timestamp, data, ` ${ip}\t`, args.join(''));
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

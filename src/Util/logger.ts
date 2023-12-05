import chalk from 'chalk';

class Logger {
    private ErrorColor: string = '#EE000F';
    private CommandColor: string = '#00EE00';
    private InfoColor: string = '#00AAFF';
    private ServerColor: string = '#FFAA00';
    private HTTPColor: string = '#0000FF';
    private LogColor: string = '#FFFFFF';

    /**
     *
     * @param type THe log type
     * @param args The stuff to log
     */
    public log(type: LogType, ...args: any[]) {
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

        // Log data
        let data: string = '';
        switch (type) {
            case LogType.Log:
                {
                    data = chalk.bgHex(this.LogColor).bold(' LOG \t\t');
                }
                break;
            case LogType.Error:
                {
                    data = chalk.bgHex(this.ErrorColor).bold(' ERROR \t\t');
                }
                break;
            case LogType.HTTP:
                {
                    data = chalk.bgHex(this.HTTPColor).bold(' HTTP \t\t');
                }
                break;
            case LogType.Info:
                {
                    data = chalk.bgHex(this.InfoColor).bold(' INFO \t\t');
                }
                break;
            case LogType.Server:
                {
                    data = chalk.bgHex(this.ServerColor).bold(' SERVER \t\t');
                }
                break;
            case LogType.Command:
                {
                    data = chalk.bgHex(this.CommandColor).bold(' COMMAND \t');
                }
                break;
            case LogType.MongoDB:
                {
                    data = chalk.bgHex(this.CommandColor).bold(' MONGODB \t\t');
                }
                break;

            default:
                {
                    data = chalk.bgHex(this.LogColor).bold(' LOG ');
                }
                break;
        }
        // Output log
        console.log(timestamp, data, args.join(''));
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

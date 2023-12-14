import chalk from 'chalk';
import config from '../../config/config.json';
import logger, { LogType } from '../Util/logger';
import app from '../index';

const { PORT, REDIRECTS } = config.WEB;

logger.log(undefined, LogType.Server, 'Initializing server...');

app.listen(PORT, () => {
    logger.log(
        undefined,
        LogType.Server,
        `Server listening on ${chalk.bold(`${PORT}`)}`
    );
});

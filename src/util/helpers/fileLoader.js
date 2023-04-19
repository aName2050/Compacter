const { glob } = require('glob');
const path = require('path');
const { log } = require('./log.js');
const chalk = require('chalk');

async function deleteCachedFile(file) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

async function loadFiles(dirName) {
    try {
        const files = await glob(
            path
                .join(process.cwd(), 'src/bot/', dirName, '**/*.js')
                .replace(/\\/g, '/')
        );
        const jsFiles = files.filter((file) => path.extname(file) === '.js');
        await Promise.all(jsFiles.map(deleteCachedFile));
        return jsFiles;
    } catch (error) {
        log(
            chalk.bgCyanBright.bold(' SERVER '),
            true,
            chalk.yellow.bold(`... `),
            chalk.redBright(`Failed to load directory ${dirName}`)
        );
        console.error(error);
        throw error;
    }
}

module.exports = { loadFiles };

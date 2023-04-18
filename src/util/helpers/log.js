const chalk = require('chalk');
/**
 *
 * @param {String} item The first bit of text to be displayed, usually containing the log info
 * @param {Boolean} timestamp Determines if a timestamp should be included
 * @param  {...String} values The message(s) to be logged
 */
function log(item, timestamp = false, ...values) {
    console.log(item, timestamp ? getTimestamp() : '', values.join(''));
}
function getTimestamp() {
    const date = new Date();
    const timestamp = `${
        date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${
        date.getHours() >= 12 ? 'PM' : 'AM'
    }`;
    return chalk.grey(timestamp);
}

module.exports = {
    log,
    getTimestamp,
};

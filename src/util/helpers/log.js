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
    const timestamp = `${pad(date.getMonth() + 1, 2)}/${pad(
        date.getDate(),
        2
    )}/${date.getFullYear()} ${pad(
        date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
        2
    )}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}.${pad(
        date.getMilliseconds(),
        3
    )} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    return chalk.grey(timestamp);
}
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
}

module.exports = {
    log,
    getTimestamp,
};

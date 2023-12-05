/**
 *
 * @param {Number} min The minimum number
 * @param {Number} max The maximum number
 * @returns {Number} The random number
 */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    randomNumber,
};

/**
 *
 * @param {any[]} array
 * @param {Number} index
 * @returns {any[]}
 */
function removeAtIndex(array, index) {
    if (index >= 0 && index < array.length) {
        array.splice(index, 1);
    }
    return array;
}

module.exports = {
    removeAtIndex,
};

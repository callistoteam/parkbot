const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
module.exports = function (x) {
    let l = 0; let n = parseInt(x, 10) || 0

    while (n >= 1024 && ++l) {
        n = n / 1024
    }
    // include a decimal point and a tenths-place digit if presenting
    // less than ten of KB or greater units
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
}

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript/23625419
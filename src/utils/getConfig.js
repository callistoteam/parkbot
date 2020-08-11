const path = require('path')

module.exports = () => {
    if(process.argv[2]) {
        try {
            // eslint-disable-next-line security/detect-non-literal-require
            return require(path.join('../../', process.argv[2]))
        } catch(e) {
            throw `Given config file "${process.argv[2]}" doesn't exist.`
        }
    } else {
        // eslint-disable-next-line node/no-unpublished-require
        return require('../../config.js')
    }
}
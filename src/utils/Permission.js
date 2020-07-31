const config = require("../../config")

module.exports.getUserPermission = function getUserPermission(user) {
    let memberPerm = 0x0
    if(config.client.dev.includes(user)) return 0x8
    return memberPerm
}
const permissions = require('../constant').permissions

const GuildMember = require('discord.js').GuildMember
module.exports = class {
    /**
     * Check permission of user
     * @param {GuildMember} user Member to Check Perm
     */

    getUserPermission(user) {
        let memberPerm = 0x0
        permissions.forEach(perm=> {
            if(perm.filter(user)) memberPerm = memberPerm | perm.flag
        })
    }
    compare(base, usrPerm) {
        return base & usrPerm === base
    }
}
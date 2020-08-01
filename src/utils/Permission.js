const permissions = require('../constant').permissions

module.exports = class {
    /**
     * Check permission of user
     * @param {GuildMember} user Member to Check Perm
     */
    static getUserPermission(user) {
        let memberPerm = 0x0
        permissions.forEach(perm=> {
            if(perm.filter(user)) memberPerm = memberPerm | perm.flag
        })

        return memberPerm
    }
    static compare(base, usrPerm) {
        return (base & usrPerm) === base
    }
}
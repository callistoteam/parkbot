// eslint-disable-next-line node/no-unpublished-require
const config = require('../../config')

const permissions = [
    {
        name: 'general',
        flag: 0x0,
        filter: () => true
    },
    {
        name: 'premium',
        flag: 0x1,
        filter: (member) => member.data.premium > new Date()
    },
    {
        name: 'admin',
        flag: 0x2,
        filter: (member) => member.hasPermission(8)
    },
    /*{
        name: 'bughunter',
        flag: 0x4,
        filter: (member) => config.client.bughunter.includes(member.id)
    }, */
    {
        name: 'team',
        flag: 0x8,
        filter: (member) => config.client.team.includes(member.id)
    },
    {
        name: 'dev',
        flag: 0x16,
        filter: (member) => config.client.dev.includes(member.id)
    }
] 

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
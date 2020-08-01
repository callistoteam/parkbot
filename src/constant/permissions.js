const config = require('../utils/getConfig')()

module.exports = [
    {
        name: 'general',
        flag: 0x0,
        filter: () => true
    },
    {
        name: 'admin',
        flag: 0x1,
        filter: (member) => member.hasPermission(8)
    },
    /*{
        name: 'bughunter',
        flag: 0x5,
        filter: (member) => config.client.bughunter.includes(member.id)
    }, */
    {
        name: 'team',
        flag: 0x7,
        filter: (member) => config.client.team.includes(member.id)
    },
    {
        name: 'dev',
        flag: 0x8,
        filter: (member) => config.client.dev.includes(member.id)
    }
] 

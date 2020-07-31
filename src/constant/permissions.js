const config = require('../utils/getConfig')()

module.exports = [
    {
        name: 'general',
        flag: 0x0,
        filter: () => true
    },
    {
        name: 'dev',
        flag: 0x8,
        filter: (member) => config.client.dev.includes(member.id)
    }
]
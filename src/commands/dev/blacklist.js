const Command = require('../../structures/Command')

module.exports = class Blacklist extends Command {
    constructor(client) {
        super(client)
        this.alias = [ '블랙리스트', 'blacklist' ]
        this.permission = 0x8
        this.category = 'dev'
    }

    async execute({ client, message }){
        if(!message.data.arg[0]) return message.reply('추가/제거')
        if(!message.data.arg[1]) return message.reply('아이디')
        if(message.data.arg[0] == '추가'){
            await client.knex('users').update({ blacklist: 1 }).where('id', message.data.arg[1])
        }
        else if(message.data.arg[0] == '제거') {
            await client.knex('users').update({ blacklist: 0 }).where('id', message.data.arg[1])
        }
    }
}
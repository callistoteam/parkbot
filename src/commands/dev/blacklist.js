const Command = require('../../structures/Command')

module.exports = class Exec extends Command {
    constructor(client) {
        super(client)
        this.alias = [ 'exec' ]
        this.permission = 0x8
        this.category = 'dev'
    }

    async execute({ client, message }){
        if(message.data.arg[0] == '추가'){
            await client.knex.update({ blacklist: 1 }).where('id', message.data.arg[1])
        }
        else if(message.data.arg[0] == '제거') {
            await client.knex.update({ blacklist: 0 }).where('id', message.data.arg[1])
        }
    }
}
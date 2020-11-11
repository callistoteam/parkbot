const { Command, Database } = require('../../utils')

module.exports = class SetMoney extends Command {
    constructor(client){
        super(client)
        this.alias = [ '돈설정', 'sm' ]
        this.args = [ { name: '아이디', required: true }, { name: '돈', required: true } ]
        this.permission = 0x16
        this.category = 'point'
    }

    async execute({ client, message }){
        let fakeData = { author: { id: message.data.arg[0] } }
        if(!Database.getUserData(client, fakeData)) return message.reply('올바르지 않은 데이터')
        await client.knex('users').update({ point: message.data.arg[1] }).where({ id: message.data.arg[0] })
        message.reply('완료')
    }
}
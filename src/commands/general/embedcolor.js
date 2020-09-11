let isHex = require('is-hex')
const Command = require('../../structures/Command')
const { Embed } = require('../../structures')

module.exports = class Embedcolor extends Command {
    constructor(client){
        super(client)
        this.alias = [ '컬러', 'embedcolor', '드ㅠㄷㅇ채ㅣㅐㄱ' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ client, message }){
        if(message.author.data.premium < new Date()) return message.reply(new Embed(message).premium())
        if(!message.data.args) return message.reply('HEX코드를 입력해줘!')
        let color = message.data.arg[0].replace('#', '').replace('0x', '')
        if(!isHex(color)) return message.reply('올바른 헥스코드를 입력해줘. \n\n<https://www.google.com/search?q=color+picker> 여기서 자신이 원하는 색을 찾은 후 hex를 복사하면 돼.')
        await client.knex('users').update({color: color}).where('id', message.author.id)
        message.reply(new Embed(message).embedcolor(color))
    }
}
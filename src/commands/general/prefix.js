const Command = require('../../structures/Command')

module.exports = class Prefix extends Command {
    constructor(client){
        super(client)
        this.alias = [ '접두사', '접두어', 'prefix' ]
        this.permission = 0x1
        this.category = 'general'
    }

    async execute({ client, message }){
        if(!message.data.arg[0]) return message.reply('설정할 접두사를 입력해줘!')
        await client.knex('guild').update({prefix: message.data.arg[0].split('\\').join('')}).where('id', message.guild.id)
        message.reply(`해당 길드의 접두사가 \`${message.data.arg[0].split('\\').join('')}\`로 변경되었어.`)
    }
}
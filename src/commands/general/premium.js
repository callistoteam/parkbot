const Command = require('../../structures/Command')

module.exports = class Premium extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'premium', '프리미엄' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ message }){
        message.reply('준비중인 기능입니다.')
        
    }
}
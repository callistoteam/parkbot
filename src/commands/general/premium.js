const Command = require('../../structures/Command')
const { Embed } = require('../../structures')

module.exports = class Premium extends Command {
    constructor(client){
        super(client)
        this.alias = [ '프리미엄', '프리미엄' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ message }){
        message.reply(new Embed(message).premium())
    }
}
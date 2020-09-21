const { Command, Embed } = require('../../utils')

module.exports = class Premium extends Command {
    constructor(client){
        super(client)
        this.alias = [ '프리미엄', 'premium' ]
        this.permission = 0x0
        this.category = 'premium'
    }

    async execute({ message }){
        message.reply(new Embed(message).premium(message.author.data))
    }
}
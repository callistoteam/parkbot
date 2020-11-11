const { Command, Embed } = require('../../utils')

module.exports = class Buy extends Command {
    constructor(client){
        super(client)
        this.alias = [ '구매', 'buy' ]
        this.permission = 0x0
        this.category = 'point'
    }

    async execute({ message }){
        // message.reply(new Embed(message).wallet(message))
    }
}
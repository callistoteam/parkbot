const { Command, Embed } = require('../../utils')

module.exports = class Wallet extends Command {
    constructor(client){
        super(client)
        this.alias = [ '지갑', 'wallet' ]
        this.permission = 0x0
        this.category = 'point'
    }

    async execute({ message }){
        message.reply(await new Embed(message).wallet(message))
    }
}
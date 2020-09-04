const Command = require('../../structures/Command')
const Discord = require('discord.js')

module.exports = class Premium extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'premium', '프리미엄' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ client, message }){
        
    }
}
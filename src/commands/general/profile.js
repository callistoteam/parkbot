const Command = require('../../structures/Command')
const Discord = require('discord.js')
const { Embed } = require('../../structures')

module.exports = class Profile extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'profile', '프로필' ]
        this.permission = 0x0
        this.category = 'general'
    }

    async execute({ client, message }){
        message.channel.send(new Embed(message).profile(message.author.data))
    }
}
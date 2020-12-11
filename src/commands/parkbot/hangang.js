const { Command, Embed } = require('../../utils')

module.exports = class Hangang extends Command {
    constructor(client){
        super(client)
        this.alias = [ '한강', 'hangang']
        this.permission = 0x0
        this.category = 'parkbot'
    }

    async execute({ client, message }){
        // eslint-disable-next-line node/no-extraneous-require
        var rqd = await require('node-fetch')(client.config.api.hangang).then(r => r.json())

        message.reply(new Embed(message).hangang(rqd))
    }   
}
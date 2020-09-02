const Command = require('../../structures/Command')
const { Embed } = require('../../structures')

module.exports = class Nowplay extends Command {
    constructor(client){
        super(client)
        this.alias = [ 'nowplay', 'np', 'ㅞ' ]
        this.permission = 0x0
        this.category = 'music'
    }

    async execute({ message, player }){
        if(!player) return message.reply('이 서버에서 재생중인 음악이 없어!')

        let server = ''
        if(player.node.options.host.includes('org')){
            server = 'Premium'
        } else {
            server = 'Normal'
        }

        message.channel.send(new Embed(message).nowPlay(player.queue.get(1), server))
    }
}
